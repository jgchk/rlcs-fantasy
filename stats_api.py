import requests

import database
import urllib.parse

player_history_base_url = 'https://api.octane.gg/api/player_recent/'
scoreboard_base_urls = [
    'https://api.octane.gg/api/match_scoreboard_overview_one/',
    'https://api.octane.gg/api/match_scoreboard_overview_two/'
]


def get_match_history(player):
    def get_match_history_page(page_num):
        player_history_url = player_history_base_url + urllib.parse.quote(player)
        player_history_response = requests.get(url=player_history_url, params={
            'page': page_num,
            'per_page': 20
        })
        player_history_data = player_history_response.json()
        if 'Error' in player_history_data:
            return None

        for match_data in player_history_data['data']:
            scoreboard_data = get_player_scoreboard_data_for_match(match_id=match_data['match_url'])
            if scoreboard_data:
                yield match_data['Date'], match_data['EventHyphenated'], scoreboard_data

    def get_player_scoreboard_data_for_match(match_id):
        for scoreboard_base_url in scoreboard_base_urls:
            scoreboard_url = scoreboard_base_url + match_id
            scoreboard_response = requests.get(url=scoreboard_url)
            scoreboard_data = scoreboard_response.json()
            if 'Error' in scoreboard_data:
                continue
            for player_scoreboard_data in scoreboard_data['data']:
                if player_scoreboard_data['Player'].lower() != player.lower():
                    continue
                return {
                    'SCPG': player_scoreboard_data['SCPG'],
                    'GPG': player_scoreboard_data['GPG'],
                    'APG': player_scoreboard_data['APG'],
                    'SAPG': player_scoreboard_data['SAPG'],
                    'SHPG': player_scoreboard_data['SHPG']
                }

    page = 1
    valid_page = True
    while valid_page:
        valid_page = False
        for match in get_match_history_page(page):
            valid_page = True
            yield match
        page += 1


def get_player_matches():
    print('Fetching match data...')
    players = database.get_players()
    for i, player in enumerate(players):
        print(player, '({}/{})'.format(i + 1, len(players)))
        for date, event, stats in get_match_history(player):
            database.store_match(player, date, event, stats)

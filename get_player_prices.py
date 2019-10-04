from bs4 import BeautifulSoup

import database


def get_player_prices():
    print('Reading player/price data...')
    soup = read_html()
    for name, team, price in parse_players(soup):
        database.store_player(name, team, price)


def read_html():
    with open('Fantasy RLCS by Rocket League Garage.html') as f:
        return BeautifulSoup(f.read(), 'html.parser')


def parse_players(soup):
    player_cards = soup.select('.rlg-fantasy-myteam-player')
    for player_card in player_cards:
        name = player_card.select('.rlg-fantasy-myteam-player__name')[0].string
        team = player_card.select('.rlg-fantasy-myteam-player__team')[0].string
        price = int(player_card['data-player-cost'])
        yield (name, team, price)


if __name__ == '__main__':
    get_player_prices()

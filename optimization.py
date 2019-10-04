import itertools

import database

positions = ['attacker', 'attacker', 'midfielder', 'midfielder', 'defender', 'defender']
position_configs = set(itertools.permutations(positions))
team_size = 6


def find_best_team():
    def team_price(team_):
        return sum([player_data[teammate]['price'] for teammate in team_])

    def score_team(config):
        return sum([player_data[teammate][position] for teammate, position in config])

    player_data = database.get_price_and_scores_dict()

    best_team = []
    best_score = 0
    for team in itertools.combinations(player_data.keys(), team_size):
        if team_price(team) > 10000:
            continue

        for position_config in position_configs:
            team_config = list(zip(team, position_config))
            team_score = score_team(team_config)
            if team_score > best_score:
                print(best_team)
                print(best_score)
                best_team = team_config
                best_score = team_score

    return best_team

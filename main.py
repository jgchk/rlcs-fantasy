from get_player_prices import get_player_prices
from optimization import find_best_team
from prediction import make_predictions
from stats_api import get_player_matches

if __name__ == '__main__':
    get_player_prices()
    get_player_matches()
    make_predictions()
    find_best_team()

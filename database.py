import dataset

db = dataset.connect('sqlite:///fantasy.db')


def store_player(name, team, price):
    row = {'player': name, 'team': team, 'price': price}
    db['player'].upsert(row, ['player'])


def get_players():
    players = list(db['player'].all())
    return [player['player'] for player in players]


def get_player_price(player):
    return db['player'].find_one(player=player)['price']


def store_match(player, date, event, stats):
    row = {'player': player, 'date': date, 'event': event, **stats}
    db['match'].upsert(row, ['player', 'date', 'event', *stats.keys()])


def build_match_query(player, event_list):
    base = "SELECT * FROM match WHERE player='{player}' AND ({event})"
    event = ' OR '.join(["event LIKE '{}'".format(event) for event in event_list])
    return base.format(player=player, event=event)


def get_rlcs_matches(player):
    rlcs_events = [
        'rlcs-season-seven-north-america',
        'rlcs-season-seven-europe',
        'gfinity-oceanic-masters-season-one',
        'rocket-street-grand-series-season-one'
    ]
    query = build_match_query(player, rlcs_events)
    return list(db.query(query))


def get_rlrs_matches(player):
    rlrs_events = [
        'rlrs-season-seven-north-america',
        'rlrs-season-seven-europe',
        'rlrs-season-six-north-america',
        'rlrs-season-six-europe'
    ]
    query = build_match_query(player, rlrs_events)
    return list(db.query(query))


def store_predicted_stats(player, stats):
    row = {'player': player, **stats}
    db['prediction'].upsert(row, ['player'])


def store_predicted_scores(player, attacker, midfielder, defender):
    row = {'player': player, 'attacker': attacker, 'midfielder': midfielder, 'defender': defender}
    db['score'].upsert(row, ['player'])


def get_price_and_scores_dict():
    scores_dict = {d['player']: d for d in list(db['score'].all())}
    for player in scores_dict:
        scores_dict[player]['price'] = get_player_price(player)
    return scores_dict


if __name__ == '__main__':
    print(get_players())

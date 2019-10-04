import database

rlrs_modifiers = {
    'SCPG': 1.0311447406492693,
    'GPG': 0.7081395749401123,
    'APG': 0.6644935994472578,
    'SAPG': 1.102167181469588,
    'SHPG': 0.8642319069316937
}


def predict_stats(player):
    rlcs_matches = database.get_rlcs_matches(player)
    rlrs_matches = database.get_rlrs_matches(player)
    if not (rlcs_matches or rlrs_matches):
        return

    stats = {
        'SCPG': 0,
        'GPG': 0,
        'APG': 0,
        'SAPG': 0,
        'SHPG': 0
    }

    for rlcs_match in rlcs_matches:
        for stat in stats:
            stats[stat] += rlcs_match[stat]

    for rlrs_match in rlrs_matches:
        for stat in stats:
            stats[stat] += rlrs_match[stat] * rlrs_modifiers[stat]

    for stat in stats:
        stats[stat] /= len(rlcs_matches) + len(rlrs_matches)

    return stats


def calculate_score(predicted_stats):
    attacker_score = midfielder_score = defender_score = 0
    multipliers = {
        'SCPG': 1,
        'GPG': 50,
        'APG': 25,
        'SAPG': 25,
        'SHPG': 15
    }

    for stat, multiplier in multipliers.items():
        score = predicted_stats[stat] * multiplier
        if stat == 'GPG':
            attacker_score += score * 2
            defender_score += score
            midfielder_score += score
        elif stat == 'APG':
            midfielder_score += score * 2
            defender_score += score
            attacker_score += score
        elif stat == 'SAPG':
            defender_score += score * 2
            midfielder_score += score
            attacker_score += score

    return attacker_score, midfielder_score, defender_score


def make_predictions():
    for player in database.get_players():
        stats = predict_stats(player)
        if stats:
            database.store_predicted_stats(player, stats)
            database.store_predicted_scores(player, *calculate_score(stats))
        else:
            print('No stats for ' + player)

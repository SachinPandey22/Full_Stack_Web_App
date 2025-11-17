import pytest

from users.utils import _mifflin_st_jeor, compute_targets


@pytest.mark.parametrize(
    "sex,weight,height,age,expected",
    [
        # values picked so math is easy to verify by hand
        ("male",   70, 175, 25, 10 * 70 + 6.25 * 175 - 5 * 25 + 5),
        ("female", 60, 165, 30, 10 * 60 + 6.25 * 165 - 5 * 30 - 161),
    ],
)
def test_mifflin_st_jeor_male_female(sex, weight, height, age, expected):
    """
    _mifflin_st_jeor should implement the standard Mifflin–St Jeor formula
    for male and female with the correct sex-specific constant.
    """
    result = _mifflin_st_jeor(sex, weight, height, age)
    assert pytest.approx(result, rel=1e-6) == expected


def test_compute_targets_goal_lose_vs_gain():
    """
    For the same person and activity level, changing goal from 'lose' to 'gain'
    should lower or raise target_calories in the expected direction.
    """
    base_kwargs = dict(
        sex="male",
        weight_kg=70,
        height_cm=175,
        age_years=25,
        activity_level="moderate",
    )

    lose = compute_targets(goal="lose", **base_kwargs)
    maintain = compute_targets(goal="maintain", **base_kwargs)
    gain = compute_targets(goal="gain", **base_kwargs)

    assert lose.target_calories < maintain.target_calories < gain.target_calories
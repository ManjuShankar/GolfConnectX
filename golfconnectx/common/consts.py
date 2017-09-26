MODE_FILE = 0
MODE_IMAGE = 1

IMAGE_ORIGINAL = 0
IMAGE_THUMB = 1
IMAGE_MED = 2

TIMEZONE_PAIRS = (
    ('NZ',                      '+13 (NZDT) New Zealand Daylight Time'),
    ('Asia/Kamchatka',          '+12 (NZT)  New Zealand Time'),
    ('Australia/Melbourne',     '+11 (LIGT) Melbourne, Australia'),
    ('Australia/Adelaide',      '+10 (AEST) Australia Eastern Standard Time'),
    ('Australia/Darwin',        '+9  (CAST) Central Australia Standard Time'),
    ('Asia/Seoul',              '+9  (KST)  Korea Standard Time'),
    ('Asia/Tokyo',              '+9  (JST)  Japan Standard Time'),
    ('Australia/Perth',         '+8  (AWST) Australia Western Standard Time'),
    ('Asia/Hong_Kong',          '+8  (CCT)  China Coastal Time'),
    ('Asia/Singapore',          '+8  (SGT)  Singapore Standard Time'),
    ('Asia/Hong_Kong',          '+8  (HKT)  Hong Kong Time'),
    ('Asia/Bangkok',            '+7  (THA)  Thailand Standard Time'),
    ('Asia/Almaty',             '+6  (ALMT) Alma-Ata Time'),
    ('Indian/Maldives',         '+5  (MVT)  Maldives Time'),
    ('Asia/Baku',               '+4  (AZT)  Azerbaijan Time'),
    ('Etc/GMT-3',               '+3  (GMT-3)'),
    ('Europe/Moscow',           '+3  (MSK)  Moscow Time'),
    ('Etc/GMT-2',               '+2  (GMT-2)'),
    ('EET',                     '+2  (EET)  Eastern Europe Time'),
    ('CET',                     '+1  (CET)  Central Europe Time'),
    ('MET',                     '+1  (MET)  Middle Europe Time'),
    ('WET',                     '+0  (WET)  Western Europe'),
    ('UTC',                     '(UTC) Universal Time, Coordinated'),
    ('Atlantic/Azores',         '-1  (AT)   Azores Time'),
    ('America/Montevideo',      '-2  (FST)  French Summer Time'),
    ('America/Campo_Grande',    '-3  (BST)  Brazil Standard Time'),
    ('America/Halifax',         '-4  (AST)  Atlantic Standard Time'),
    ('US/Eastern',              '-4  Eastern Time'),
    ('America/New_York',        '-5  New York/Toronto/Detroit/Montreal'),
    ('America/Chicago',         '-6  (CST)  Central Standard Time (USA)'),
    ('US/Mountain',             '-7  (MST)  Mountain Time (USA)'),
    ('America/Denver',          '-7  Denver/Phoenix'),
    ('US/Pacific',              '-8  (PST)  Pacific Time (USA)'),
    ('America/Los_Angeles',     '-8  Los Angeles/Tijuana/Vancouver'),
    ('America/Anchorage',       '-9  (AKST) Alaska Standard Time'),
    ('HST',                     '-10 (HST)  Hawaii Standard Time'),
    ('Pacific/Midway',          '-11 (FST)  Bering Standard Time'),
    ('Etc/GMT+12',              '-12 GMT+12')
)

from datetime import timedelta
def convertDate(cdate):
    cdate = cdate-timedelta(hours=4)
    strdate = cdate.strftime('%b %d %Y - %I:%M %p')
    return strdate



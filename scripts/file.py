import re
import sys
import os
v=sys.argv[1]
rg="(?P<maj>\d.+)"
match=re.search(rg,v)
if match:
    major=match.group('maj')
    print("Current Version:",major)
    with open ('.env', 'w') as writer:
        writer.write (f'export major="{major}"')

open website/.env | load-env
def sql [query: string] {
    psql $env.DATABASE_URL --csv -c $query | from csv
}

###

# List videos
sql "select title from video limit 50" | get title

sql "\\dt" | get name

sql "select * from \"session\" limit 50" | print

sql "select * from \"metadata\" limit 50" | print -e

sql "select * from \"user\" limit 50"

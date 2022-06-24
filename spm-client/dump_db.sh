cd "c:/Program Files/PostgreSQL/14/bin"
./pg_dump -h localhost -U postgres -p 5432 -d spm_test -f "$HOME/personal/spm/spm-client/spm_test.sql"

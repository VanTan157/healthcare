#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE user_db;
    CREATE DATABASE patient_db;
    CREATE DATABASE doctor_db;
    CREATE DATABASE insurance_db;
    CREATE DATABASE laboratory_db;
    CREATE DATABASE notification_db;
    CREATE DATABASE payment_db;
    CREATE DATABASE pharmacy_db;
EOSQL
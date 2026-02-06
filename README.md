# eventManagementApi

# create modal for table
npx sequelize-auto -o "./models"  --cm p --cp c --cf p -d <db> -h localhost -u <username> -p 3306 -x <password> -e mysql -l ts

# generate migration file
npx sequelize-cli migration:generate --name <fileanem>

# run redis server
redis-server

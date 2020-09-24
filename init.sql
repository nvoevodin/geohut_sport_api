#Table List

#userLogins //user authenticaion in FB
#check_ins //checkins
#locations //construction sites
#userInfo //user information to validate person can sign in

#create quick test table

#create allowed users table
DROP TABLE proBono.allowed_users;
CREATE TABLE IF NOT EXISTS proBono.allowed_users(
id VARCHAR(50),
user_id VARCHAR(45),
first_name VARCHAR(45),
last_name VARCHAR(45),
site_id VARCHAR(100),
primary key (user_id)
);

INSERT INTO proBono.allowed_users(id,user_id, first_name, last_name, site_id)
VALUES
('faustolopez110@gmail.com', '1791', 'Fausto', 'Lopez', 'B0001'),
('voevodin.nv@gmail.com', '1234', 'Nikita', 'Voevodin', 'B0002'),
('oliviatorres@gmail.com', '2421', 'Olivia', 'Torres', 'B0003');


#sql working files for setting up tables etc



#table that holds user information to check
#this will be created by them in their database
#DROP TABLE proBono.user_info;
CREATE TABLE IF NOT EXISTS proBono.user_info(
	user_id VARCHAR(45),
    phone VARCHAR(10),
    email VARCHAR(25),
    site_id VARCHAR(10),
    PRIMARY KEY (site_id)
);

INSERT INTO proBono.user_info(user_id, phone, email, site_id)
VALUES
('1234', 6466393360, 'faustolopez110@gmail.com', 'B0001'),
('1235', 7182881459, 'voevodin.nv@gmail.com', 'B0002');

#table that holds site locations
#DROP TABLE proBono.construction_sites;
CREATE TABLE IF NOT EXISTS proBono.construction_sites(
     site_id VARCHAR(100),
     site_name VARCHAR(100),
     site_address VARCHAR(100),
     latitude float,
     longitude float,
     site_manager VARCHAR(30),
     PRIMARY KEY (site_id)
     );

#insert sample site for testing radius
#we should insert our house locations as well
INSERT INTO proBono.construction_sites (site_id, site_name, site_address , latitude, longitude, site_manager)
VALUES
('B0002', 'nikitasite', '2035 E 7th Street Brooklyn NY 11223', 40.6009716 , -73.9642833 ,'Nikita Voevodin'),
('B0001', 'faustosite', '23-48 Broadway Street Astoria NY 11106' , 40.7635514, -73.9289525 , 'Fausto Lopez');

SELECT * FROM proBono.construction_sites;

#add lat, lon and event type to checkin
ALTER TABLE proBono.check_ins ADD COLUMN latitude FLOAT;
ALTER TABLE proBono.check_ins ADD COLUMN longitude FLOAT;
ALTER TABLE proBono.check_ins ADD COLUMN checkin_type INT;
ALTER TABLE proBono.check_ins ADD COLUMN distance INT;

#testing retrieving site information based on email
SELECT
user_info.email,
construction_sites.site_id,
construction_sites.site_name,
construction_sites.latitude,
construction_sites.longitude,
construction_sites.site_address
FROM
proBono.user_info inner join proBono.construction_sites ON
proBono.user_info.site_id = proBono.construction_sites.site_id
WHERE
proBono.user_info.email = 'voevodin.nv@gmail.com';


#testing retrieving site information based on user id
SELECT
allowed_users.user_id,
construction_sites.site_id,
construction_sites.site_name,
construction_sites.latitude,
construction_sites.longitude,
construction_sites.site_address
FROM
proBono.allowed_users inner join proBono.construction_sites ON
proBono.allowed_users.site_id = proBono.construction_sites.site_id
WHERE
proBono.allowed_users.user_id = '1791';



Select * from proBono.check_ins;



#add another allowed user for fausto
INSERT INTO proBono.allowed_users(id,user_id, first_name, last_name, site_id)
VALUES
('lopezf.tlc@gmail.com', '1792', 'Fausto', 'Lopez', 'B0006');


#add anotehr site for fausto
INSERT INTO proBono.construction_sites (site_id, site_name, site_address , latitude, longitude, site_manager)
VALUES
('B0006', 'faustoFamilyHouse', '110-23 55 ave 2nd floor', 40.739910 , -73.848050 ,'Fausto Lopez');


#add anotehr sire for olivia
INSERT INTO proBono.construction_sites (site_id, site_name, site_address , latitude, longitude, site_manager)
VALUES
('B0003', 'oliviaPlace', '30-74 32nd street', 40.760890, -73.925180 ,'Olivia Torrea');

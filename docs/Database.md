<!-- This file details the SQl commands used to set-up the Database, what Data was inserted & the queries we'd need to get the data --!>

SQLCOMMANDS  FOR ChefAppDb DATABASE Created in MySql, Terminator 15/06
REMEMBER: IF U WANT TO DELETE/UPDATE FROM A TABLE USE THIS SQL:
DELETE FROM `table_name` [WHERE condition];

UPDATE table_name SET column_name = new_value [WHERE condition];

CREATE DATABASE ChefAppDb;

USE ChefAppDb;

CREATING THE CHEF TABLE
CREATE TABLE CHEF (chefId INT NOT NULL AUTO_INCREMENT, chefName VARCHAR (255) NOT NULL, chefContact VARCHAR (255), chefLocation VARCHAR (255), PRIMARY KEY(chefId));

Will need to alter table CUSTOMER as I didn't add the custDietReqs field, sql is:
ALTER TABLE CUSTOMER ADD COLUMN custDietReqs AFTER custContact;

CREATING THE CUSTOMER TABLE
CREATE TABLE CUSTOMER (custId INT NOT NULL AUTO_INCREMENT, custName VARCHAR (255) NOT NULL, custAddress VARCHAR (255) NOT NULL, custContact VARCHAR (255), custDietaryReqs  VARCHAR (250), PRIMARY KEY(custId));

CREATING THE TYPE TABLE
CREATE TABLE TYPE (typeId INT NOT NULL AUTO_INCREMENT, typeCategory VARCHAR (255) NOT NULL, typePricePerGuest DECIMAL(10,2) NOT NULL, PRIMARY KEY(typeId));

CREATING THE MENU TABLE
CREATE TABLE MENU (menuId INT NOT NULL AUTO_INCREMENT, chefId INT NOT NULL, typeId INT NOT NULL, menuCuisine VARCHAR (255), menuMeals VARCHAR (255) NOT NULL, menuDietaryReqs VARCHAR (250), PRIMARY KEY (menuId), FOREIGN KEY (chefId) REFERENCES CHEF(chefId), FOREIGN KEY (typeId) REFERENCES TYPE(typeId));

We need to alter the table MENU so that it can store Images; there are 2 ways to do this: hold a filepath using a VARCHAR data type to access the image file which could be held on a computer, or store the actual file using a LONGBLOB data type. Have gone with storing the File Path after speaking to Harriet as that's what she recommends.
ALTER TABLE MENU ADD COLUMN menuImageFPath VARCHAR(255) AFTER menuMeals;
If I did want to store the image itself I would do it with this command:

ALTER TABLE MENU ADD COLUMN menuImage BLOB AFTER menuImageFPath;

17/06/19 As I had already added the image file to the MENU table before I spoke to Harriet, I'm having to use the following to get rid of the field as it's no longer needed. SQL FOR THIS IS:
ALTER TABLE MENU DROP COLUMN menuImage;

BMENU TABLE CREATED in case time is short & we struggle to get the Sql to work for the MENU/TYPE Tables relationship.

CREATE TABLE BMENU(menuId INT NOT NULL AUTO_INCREMENT, chefId INT NOT NULL, menuCategory VARCHAR(255), menuCuisine VARCHAR(255) NOT NULL, menuMeals VARCHAR(255) NOT NULL), menuPricePerGuest DECIMAL(10,2) NOT NULL, menuDietReqs VARCHAR(250), PRIMARY KEY (menuId), FOREIGN KEY(chefId) REFERENCES CHEF(chefId));

ALTER TABLE BMENU ADD COLUMN menuImageFPath VARCHAR(255) AFTER menuMeals;

CREATING THE BOOKING TABLE: set bookingConfirmed & bookingCancelled fields to 0(false) as DEFAULT so that they must be ticked to be changed.

NOTE: We are using DATE instead of DATETIME as it is easier to manipulate/compare values etc

CREATE TABLE BOOKING (bookingId INT NOT NULL AUTO_INCREMENT, custId INT NOT NULL, chefId INT NOT NULL, menuId INT NOT NULL, bookingDate DATE NOT NULL, bookingGuestNum INT NOT NULL, bookingAmount DECIMAL(10,2), bookingConfirmed BOOLEAN DEFAULT 0, bookingCancelled BOOLEAN DEFAULT 0, PRIMARY KEY (bookingId), FOREIGN KEY (custId) REFERENCES CUSTOMER(custId), FOREIGN KEY (chefId) REFERENCES CHEF(chefId), FOREIGN KEY (menuId) REFERENCES MENU(menuId));

<!-- SQL QUERIES DEFINED TO GET THE DATA WE NEED -->

THESE ARE ALL EXAMPLES OF SEARCHES WE CAN DO ON THE CHEFAPP DATABASE, FOR THE ONES WE REALLY NEED TO FIND AVAILABLE CHEFS ON A PARTICULAR DAY GO TO END OF PAGE.

Search for a particular Chef's menu and details from the CHEF & MENU tables:
SELECT menuId, MENU.chefId, CHEF.chefName, menuCuisine, menuMeals FROM MENU JOIN CHEF ON CHEF.chefId=MENU.chefId WHERE MENU.chefId=3;

Search for any Chef's menu, meals, typeCategory, typePricePerGuest, menuCuisine with his chefId; both queries work.

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest, MENU.menuMeals FROM MENU JOIN CHEF ON CHEF.chefId=MENU.chefId JOIN TYPE ON TYPE.typeId=MENU.typeId;

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest, MENU.menuMeals FROM ((MENU INNER JOIN CHEF ON CHEF.chefId=MENU.chefId) INNER JOIN TYPE ON TYPE.typeId=MENU.typeId);

Search for a particular Chef's menu, meals, typeCategory, typePricePerGuest, menuCuisine with his chefId; both queries work.

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest, MENU.menuMeals FROM MENU JOIN CHEF ON CHEF.chefId=MENU.chefId JOIN TYPE ON TYPE.typeId=MENU.typeId WHERE MENU.chefId=5;

Search for a particular category of food, eg MENU.typeId=1 (Simple)
SELECT MENU.menuId, MENU.chefId, CHEF.chefName, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest, MENU.menuMeals FROM MENU JOIN CHEF ON CHEF.chefId=MENU.chefId JOIN TYPE ON TYPE.typeId=MENU.typeId WHERE MENU.chefId=5;

WORK DONE 19/06/2019:
Trying to work out how to search for chef not booked on a particular date.

WILL HAVE TO SLOWLY BUILD QUERY TO FIND AVAILABLE CHEFS & THEIR MENUS

HOW TO SET UP A COLUMN ALIAS:
SELECT chefId FROM BOOKING AS `b.chefId`;

WILL TRY TO DO A NESTED SELECT BY DOING A SUBQUERY & SEEING IF THAT WORKS:

SELECT chefId FROM MENU WHERE chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01');

NOW TO ADD IN MORE DETAILS FROM THE MENU TABLE TO QUERY ABOVE & SEE IF THEY WORK:

SELECT chefId, menuId, typeId, menuCuisine FROM MENU WHERE chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01');

GREAT, ABOVE QUERY WORKED, SO NOW TO ADD IN FIELDS FROM TYPE TABLE TO SEE IF THAT WORKS...

SELECT MENU.chefId, MENU.menuId, MENU.typeId, MENU.menuCuisine, TYPE.typeCategory, TYPE.typePricePerGuest FROM MENU JOIN TYPE ON MENU.typeId=TYPE.typeId WHERE MENU.chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01');

THANK GOD, ABOVE QUERY WORKED, SO NOW TO ADD IN CHEF DETAILS FOR CHEFS FOUND.

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.typeId, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest FROM MENU JOIN TYPE ON MENU.typeId=TYPE.typeId JOIN CHEF ON MENU.chefId=CHEF.chefId WHERE MENU.chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01');


NOW THAT WE KNOW HOW TO FIND CHEFS AND THEIR MENUS THAT ARE NOT ALREADY BOOKED ON A PARTICULAR DATE, LETS SEE IF WE CAN FILTER IT FURTHER BY MENUCuisine:

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.typeId, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest FROM MENU JOIN TYPE ON MENU.typeId=TYPE.typeId JOIN CHEF ON MENU.chefId=CHEF.chefId WHERE MENU.menuCuisine="French" AND MENU.chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01');

   EITHER ONE OF THESE QUERIES WORK!!!

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.typeId, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest FROM MENU JOIN TYPE ON MENU.typeId=TYPE.typeId JOIN CHEF ON MENU.chefId=CHEF.chefId WHERE  MENU.chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01') AND MENU.menuCuisine="French";

NOW THAT WE KNOW HOW TO DO ALL OF THE ABOE FOR A PARTICULAR AVAILABLE CHEF, WITH A PARTICULAR MENUCuisine, LET'S SEE IF WE CAN DO IT BY TYPECategory: hERE'S A TEST 1

SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.typeId, TYPE.typeCategory, MENU.menuCuisine, TYPE.typePricePerGuest FROM MENU JOIN TYPE ON MENU.typeId=TYPE.typeId JOIN CHEF ON MENU.chefId=CHEF.chefId WHERE MENU.menuCuisine="French" AND TYPE.typeCategory="Premier" AND MENU.chefId<>(SELECT chefId FROM BOOKING WHERE bookingDate='2019-01-01');

NOW MAIN MVP QUERIES WORKING!!!


<!-- TEST DATA ADDED TO DATABASE SO WE CAN CHECK IT WORKS -->

REMEMBER with AUTO_INCREMENT fields: the database automatically inserts a value into them so u don't have to. 

CHEF TABLE
INSERT INTO CHEF (chefName, chefContact, chefLocation) VALUES ("John Peters", 07712345678, "London"), ("Peter Jones", 07722222222, "Manchester"), ("Tim Smith", 07733332222, "Leeds"), ("Sean Seems", 07756567879, "London"), ("Richard Sent", 07712341234, "Manchester");

CUSTOMER TABLE
INSERT INTO CUSTOMER (custName, custAddress, custContact, custDietReqs) VALUES ("Jenny Jones", "8 Dew Rd Manchester", 01611111111, "Gluten free"), ("Josh Davies", "26 Penny Avenue London", 01212222222, "Diary free"), ("Penny Sue", "15 Shrewsbury St Manchester", 01613233333, "Normal"), ("Susie Smith", "12 Oak Lane Leeds", 01137275555, "Fat free"), ("Charlotte Heath", "72 Tree Drive Manchester", 01617629999, "Normal");

TYPE TABLE
INSERT INTO TYPE (typeCategory, typePricePerGuest) VALUES ("Simple", 25.00), ("Premier", 35.00), ("Michelin", 55.00) );

I could have put the values into MENU TABLE all at once instead of splitting it out but I did not just incase there were any errors and it might be difficult to spot them.
INSERT INTO MENU (chefId, typeId, menuCuisine, menuMeals, menuImageFPath, menuDietReqs) VALUES (1, 1, "French", "Starter: Prawn Salad, Main: Beef Shifado, Dessert: Caramel Cheesecake", "https://unsplash.com/photos/b7-L6hzNSeo", "Normal"), (2, 2, "English", "Starter: Roasted Duck, Main: Celeriac Soup, Dessert: Pomegranate Salad", "https://unsplash.com/photos/4Q_xlBOaCso", "Gluten Free"), (3, 2, "Spanish", "Starter: Lentil Stew, Main: Spanish Rice, Dessert: Orange Cake", "https://unsplash.com/photos/k2ZCm7LCj8E", "Fat Free"), (3, 3, "Spanish", "Starter: Mushroom Croquette, Main: Duck Confit, Dessert: Brioche", "https://unsplash.com/photos/O7-OF1AAsyc", "Normal"), (4, 1, "Italian", "Starter: Tortellini, Main: Beef, Dessert: Home-made Apple Pie", "https://unsplash.com/photos/6pa4ReAFO4c", "Normal");

INSERT INTO MENU (chefId, typeId, menuCuisine, menuMeals, menuImageFPath, menuDietReqs) VALUES (4, 2, "French", "Starter: Tomato Risotto, Main: Seabass Fillet, Dessert: Blueberries and Honeycomb", "https://unsplash.com/photos/VNu0yM4kFdA", "Normal");

INSERT INTO MENU (chefId, typeId, menuCuisine, menuMeals, menuImageFPath, menuDietReqs) VALUES (4, 3, "French", "Starter: Gruyere Souffle, Main: Braised Beef, Dessert: Home-made Truffles", "https://unsplash.com/photos/xKSRpUH0VZo", "Normal");

INSERT INTO MENU (chefId, typeId, menuCuisine, menuMeals, menuImageFPath, menuDietReqs) VALUES (5, 1, "Spanish", "Starter: Patatas Bravas, Main: Braised Squid, Dessert: Churros", "https://unsplash.com/photos/W40k_qWjx4U", "Normal");

INSERT INTO MENU (chefId, typeId, menuCuisine, menuMeals, menuImageFPath, menuDietReqs) VALUES (5, 2, "Italian", "Starter: Chicken Caesar Salad, Main: Crusted Lamb, Dessert: Lemon Posset", "https://unsplash.com/photos/pCxJvSeSB5A", "Dairy Free");

INSERT INTO MENU (chefId, typeId, menuCuisine, menuMeals, menuImageFPath, menuDietReqs) VALUES (5, 3, "Italian", "Starter: Oysters, Main: Marianated Fillet Steak, Dessert: Tiramisu", "https://unsplash.com/photos/au475mEaJiw", "Normal");

ADDING DATE VALUES TO A TABLE:
Unless you are formatting it with something like CURDATE() function, then use single quotes eg '2019-02-27', remember it goes YYYY-MM-DD.

BOOKING TABLE DATA:
INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (1, 3, 1, '2019-02-27', 4, 100, 1, 0);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (5, 2, 9, '2019-01-01', 3, 105, 0, 1);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (2, 1, 2, '2019-01-12', 2, 70, 1, 0);

INSERT INTO BOOKING (bookingId, chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (4, 3, 4, 3, '2019-02-14', 5, 175, 1, 0);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (3, 5, 4, '2019-03-27', 1, 165, 1, 0);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (4, 3, 6, '2019-04-16', 5, 175, 1, 1);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (5, 2, 9, '2019-05-01', 4, 140, 1, 0);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (5, 3, 10, '2019-07-31', 2, 110, 1, 1);

INSERT INTO BOOKING (bookingId, chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (9, 5, 5, 10, '2019-07-31', 2, 110, 1, 1);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (4, 5, 5, '2019-08-03', 4, 100, 1, 0);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (5, 1, 2, '2019-08-25', 2, 70, 0, 0);

INSERT INTO BOOKING (chefId, custId, menuId, bookingDate, bookingGuestNum, bookingAmount, bookingConfirmed, bookingCancelled) VALUES (5, 5, 8, '2019-09-27', 5, 125, 1, 0);

Of Course any extra things we want to query can be added to the appropriate part of the NESTED SELECT; e.g. this could be added to the SUBQUERY part where we go the BOOKING table to find chefs booked on that day; say we only want to look for chefs who were booked on a particular day AND their booking wasn't CANCELLED, we'd add the following to the SUBQUERY(the 2nd SELECT statement which is inside the 1st one):

AND BOOKING.bookingCancelled<>1

This means we're only looking for Bookings that are not cancelled, as 1 is a BOOLEAN value for TRUE.

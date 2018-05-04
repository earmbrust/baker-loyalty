--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE Member (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, phone TEXT, points INTEGER, last_checkin INTEGER);


CREATE TABLE Checkin (id INTEGER PRIMARY KEY, memberId INTEGER, time INTEGER, CONSTRAINT Checkin_fk_memberId
                   FOREIGN KEY (memberId) REFERENCES Members (id) ON
                   UPDATE CASCADE ON
                   DELETE CASCADE);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE Member;
DROP TABLE Checkin;
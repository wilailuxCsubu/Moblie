# Mobile
Mobile Wireless Network 2560

*Topic : Lottery with #Node.js #MongoDB

### Step 1 : ติดตั้งเครื่องมือ 
* ติดตั้ง [NodeJS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) (version 8.9.1)
* ติดตั้ง [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
* ติดตั้ง [robomongo](https://robomongo.org/download)
  
### Step 2 : สร้างโปรเจค
* สร้างโปรเจคชื่อ lottery_mongodb  ใช้คำสั่ง
```
mkdir lottery_mongodb
```
เเละเข้าไปในโฟลเดอร์ lottery_mongodb ใช้คำสั่ง
```
cd lottery_mongodb
```
* สร้างไฟล์ package.json ใช้คำสั่ง
```
npm init
```
* ติดตั้ง module ใช้คำสั่ง
```
npm install
```
* สร้างไฟล์ชื่อ server.js ขึ้นมา

จากนั้น เรามาทำการ Connect Database
*เปิด Service ของ MongoDB ใช้คำสั่ง
```
sudo service mongod start  หรือ  mongod
```
### Step 3 : รันโปรเจค
* รันโปรเจค โดยใช้คำสั่ง
```
node app.js
```
*เเล้วเปิด localhost://3000

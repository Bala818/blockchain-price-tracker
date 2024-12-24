# Blockchain Price Tracker

This is a decentralized application (dApp) built with **Nest.js** to track cryptocurrency prices, send alerts, and provide APIs for price-related operations. The application is dockerized and uses a MySQL database.

---

## **Features**

1. **Automatic Price Tracking**:
   - Saves the prices of **Ethereum** and **Polygon** every 5 minutes.

2. **Email Alerts**:
   - Automatically sends an email if the price of a chain increases by more than 3% compared to its price one hour ago.

3. **APIs**:
   - **Get hourly prices** for the past 24 hours.
   - **Set price alerts** for specific cryptocurrencies.
   - **Get swap rates** between Ethereum (ETH) and Bitcoin (BTC), including transaction fees.

4. **Swagger Documentation**:
   - API documentation is available at `/api`.

5. **Dockerized Deployment**:
   - Easily runnable using a single `docker-compose` command.

---

## **Tech Stack**

- **Framework**: Nest.js
- **Database**: MySQL
- **API Client**: Axios (for fetching cryptocurrency prices from CoinGecko)
- **Scheduler**: `@nestjs/schedule`
- **Email Service**: Nodemailer
- **Documentation**: Swagger
- **Containerization**: Docker

---

## **Setup Instructions**

### Prerequisites
- Docker and Docker Compose installed on your machine.
- A valid email account for sending email alerts (e.g., Gmail).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blockchain-price-tracker
```

### 2. Create a `.env` File
Create a `.env` file in the root directory and configure it as follows:
```env
DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=price_tracker
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 3. Run the Application
Start the application using Docker Compose:
```bash
docker-compose up --build
```
Wait for the logs to show:
```
[NestApplication] Nest application successfully started
Application is running on: http://localhost:3000
Swagger is running on: http://localhost:3000/api
```

---

## **API Endpoints**

### **1. Prices**
- **GET `/prices/hourly`**:
  - Returns hourly prices for a specific cryptocurrency for the past 24 hours.
  - **Query Parameters**:
    - `chain`: `ethereum` or `polygon`

- **GET `/prices/swap-rate`**:
  - Calculates the swap rate from Ethereum (ETH) to Bitcoin (BTC).
  - **Query Parameters**:
    - `ethAmount`: The amount of Ethereum.

### **2. Alerts**
- **POST `/alerts`**:
  - Sets an alert for a specific cryptocurrency price.
  - **Request Body**:
    ```json
    {
      "chain": "ethereum",
      "targetPrice": 3500,
      "email": "example@example.com"
    }
    ```

---

## **Testing the Application**

### **1. Swagger Documentation**
- Open your browser and navigate to:
  ```
  http://localhost:3000/api
  ```
- Test all endpoints directly through the Swagger UI.

### **2. Verify Data**
- Log into the MySQL container:
  ```bash
  docker exec -it mysql mysql -u root -p
  ```
- Run the following queries to verify saved data:
  ```sql
  USE price_tracker;
  SELECT * FROM price ORDER BY timestamp DESC LIMIT 10;
  SELECT * FROM alert;
  ```

### **3. Simulate Price Increase**
- Update the price manually to test email notifications:
  ```sql
  UPDATE price SET price = price * 1.04 WHERE chain = 'ethereum';
  ```

- Monitor the logs for email sent confirmation.

---

## **Common Issues**

### 1. **Email Not Sending**
- Ensure the `EMAIL_USER` and `EMAIL_PASS` in `.env` are valid.
- If using Gmail, enable [App Passwords](https://support.google.com/accounts/answer/185833) or allow less secure apps.

### 2. **Database Connection Errors**
- Verify the MySQL container is running:
  ```bash
  docker ps
  ```
- Ensure the `.env` file has the correct database credentials.

### 3. **Swagger Not Accessible**
- Ensure Swagger is correctly set up in `main.ts`:
  ```typescript
  SwaggerModule.setup('api', app, document);
  ```

---

## **License**
This project is licensed under the MIT License.

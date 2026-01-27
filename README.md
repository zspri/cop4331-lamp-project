# cop4331-lamp-project

## Running PHP Locally

To run this project locally using the PHP built-in server:

1. **Verify PHP is installed**:
   Open a terminal and run:

   ```bash
   php -v
   ```

2. **Start the Server**:
   Navigate to the project root directory in your terminal and run:

   ```bash
   php -S localhost:8000
   ```

3. **Access the Application**:
   The backend API endpoints will be accessible at:
   [http://localhost:8000/backend/](http://localhost:8000/backend/)
   

   _Note: You may need to update the `urlBase` in `frontend/js/code.js` to point to your local backend (e.g., `http://localhost:8000/backend`)._

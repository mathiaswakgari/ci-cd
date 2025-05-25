# Use an official Python image
FROM python:3.8

# Set working directory
WORKDIR /app

# Install Flask and other dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 5000

# Run the Flask application
# Assuming your main Flask app is in 'main.py' and the app is called 'app'
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:application", "--workers=3", "--timeout=120"]

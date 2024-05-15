from flask import Flask, request, jsonify, render_template, url_for, redirect, flash
from pymongo import MongoClient
import json
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from flask_wtf.csrf import generate_csrf
from wtforms import HiddenField
# from flask_wtf.csrf import CSRFProtect
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError, Email, EqualTo
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_cors import CORS
from langchain.llms import OpenAI
import os
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain.chains.conversation.memory import ConversationBufferMemory
from flask_cors import cross_origin
from bson import ObjectId  # Import ObjectId from bson
import jwt
import datetime
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required, JWTManager
# from secret import OPENAI_API_KEY
from langchain.llms import OpenAI
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from model.endpoint import web_point

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow requests from localhost:3000




dataset = "./dataset/Employee.csv"

# Set up conversation memory
memory = ConversationBufferMemory()

app.config['SECRET_KEY'] = '43ee078a2665428e8ad5aa1695f953df'
app.config['MONGO_URI'] = 'mongodb+srv://username:sasheela0@cluster0.aqs612f.mongodb.net/?retryWrites=true&w=majority'
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
# csrf = CSRFProtect(app)
# csrf.init_app(app)
app.config["JWT_SECRET_KEY"] = "testing"
jwt = JWTManager(app)
try:
    mongo = PyMongo(app)
    print("Successfully connected to MongoDB.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# class RegistrationForm(FlaskForm):
#     # csrf_token = HiddenField()
#     name = StringField('Name', validators=[InputRequired(), Length(min=2, max=50)])
#     email = StringField('Email', validators=[InputRequired(), Email()])
#     number = StringField('Phone Number', validators=[InputRequired(), Length(min=10, max=10)])
#     password = PasswordField('Password', validators=[InputRequired(), Length(min=8)])
#     confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password')])
#     submit = SubmitField('Register')

# @app.route('/register', methods=['GET', 'POST', 'OPTIONS'])
# def register():
#     form = RegistrationForm()

#     if request.method == 'POST' and form.validate_on_submit():
#         # Hash the password before storing it in the database
#         hashed_password = bcrypt.generate_password_hash(form.password.data)

#         # Prepare user data to insert into MongoDB
#         user_data = {
#             "name": form.name.data,
#             "emailid": form.email.data,
#             "number": form.number.data,
#             "password": hashed_password
#         }
#         # Connect to MongoDB and insert user data
#         client = PyMongo.MongoClient("mongodb+srv://<kssathya>:<Kaushik963123>@cluster0.aqs612f.mongodb.net/?retryWrites=true&w=majority")
#         db = client["users"]
#         collection = db["users"]
#         collection.insert_one(user_data)

#         # Flash a success message and return a JSON response with the user data
#         print('Registration successful! Please login to your account.')
#         return jsonify({'data': user_data})

#     # If form validation fails, return a JSON response with validation errors
#     errors = {field.name: field.errors for field in form if field.errors}
#     errors['csrf_token'] = ['The CSRF token is missing.']  # Add CSRF error manually
#     return jsonify({'error': 'Registration failed', 'validation_errors': errors})

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'Authorization' in request.headers:
            token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        print("Received token:", token)
        try:
            print("Token before decoding:", token)
            print("Secret Key:", app.config['SECRET_KEY'])
            data = jwt.decode(token, app.config['SECRET_KEY'])
            print("Decoded data",data)
            client = MongoClient("mongodb+srv://newuser:sasheela0@cluster0.aqs612f.mongodb.net/?retryWrites=true&w=majority")
            db = client["users"]
            current_user = db.users.find_one({'_id': data['_id']})
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            print(f"Error decoding token: {e}")
            return jsonify({'error': 'Error decoding token'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

def get_next_sequence(collection, sequence_name):
    result = collection.find_one_and_update(
        {'_id': sequence_name},
        {'$inc': {'value': 1}},
        upsert=True,
        return_document=True
    )
    return result['value']

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    number = data.get('number')
    password = data.get('password')
    confirm_password = data.get('confirm_password')


    if not name or not email or not number or not password or not confirm_password:
        return jsonify({'error': 'Missing required fields'}), 400   

    # Phone Number Validation
    if not (number.isdigit() and len(number) == 10):
        return jsonify({'error': 'Invalid phone number'}), 400

    # Password Validation
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    
    if password != confirm_password:
        return jsonify({'error': 'Password and confirm password do not match'}), 400


    try:
        client = MongoClient("mongodb+srv://newuser:sasheela0@cluster0.aqs612f.mongodb.net/?retryWrites=true&w=majority")
        db = client["users"]
        collection = db["users"]
        existing_user = collection.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        next_id = get_next_sequence(db['counters'], 'user_id_sequence')
        user_data = {
        "_id": next_id,
        "name": name,
        "email": email,
        "number": number,
        "password": hashed_password
    }
        print("User Data:", user_data)
        collection.insert_one(user_data)
        # user_id_str = str(user_data['_id'])
        # token = jwt.encode({'_id': user_id_str, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        #                   app.config['SECRET_KEY'])
        return jsonify({ 'message': 'Registration  successful'})

        # Return a JSON response with the user data
    except Exception as e:
        print(f"Error inserting user data into MongoDB: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    # Check if the user with the provided email exists
    client = MongoClient("mongodb+srv://newuser:sasheela0@cluster0.aqs612f.mongodb.net/?retryWrites=true&w=majority")
    db = client["users"]
    collection = db["users"]
    user = db.users.find_one({'email': email})

    if not user:
        return jsonify({'error': 'User not found'}), 401
    
    user_id_str = str(user['_id'])

    # Check if the provided password matches the stored hashed password
    if bcrypt.check_password_hash(user['password'], password):
            access_token = create_access_token(identity=email)
            response = {"access_token":access_token,'message': 'Login successful'}
            return response
        # return jsonify({'token': token, 'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid password'}), 401

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

    
def process_text():
    try:
        data = request.get_json()
        text = data['text']
    # Run the prompt through the agent.
        response = web_point(text)
    # Convert the response to a string.
        print(response)
        print('The given result is \n', response)

        response_data = {
            'result': response,
            'total_length': len(response)
        }
        # Return the result as JSON response
        return jsonify(response_data)
    except Exception as e:
        # Handle exceptions (e.g., rate limit errors)
        print(f"Error processing query: {str(e)}")
        return jsonify({'error': str(e)})

# @app.route('/csrf_token', methods=['GET'])
# def get_csrf_token():
#     csrf_token = generate_csrf()
#     return jsonify({'csrf_token': csrf_token})

@app.route('/process_text', methods=['POST'])
@jwt_required()
def process_text_route():
    return process_text()

# @app.route('/register', methods=['GET', 'POST','OPTIONS'])
# # @cross_origin(origin='http://localhost:3000', headers=['Content-Type', 'Authorization'])
# # @csrf.exempt
# def register_route():
#     return register()


if __name__ == '__main__':
    app.run(debug=True)

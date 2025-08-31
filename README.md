# Clone Fest - Chyrp Blogging App

Welcome to **Clone Fest** — a clean, simple blogging app built with React and Django. Share your thoughts, explore posts, and enjoy a smooth experience.  

## Features
- User authentication (register, login)
- Create, edit, and delete posts
- Like and comment on posts
- Explore trending content
- Responsive design

## Tech Stack
- **Frontend:** React (JavaScript)
- **Backend:** Django (Python, REST API)
- **Database:** PostgreSQL

---

## Installation & Setup

### Prerequisites
- [Node.js & npm](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/)
- [PostgreSQL](https://www.postgresql.org/) (for the database)

### 1. Clone the Repository
```sh
git clone https://github.com/Amjuks/Clone-Fest-Chyrp.git
cd Clone-Fest-Chyrp
````

### 2. PostgreSQL Setup

* Install PostgreSQL and create a database (e.g., `chyrp_db`).
* Create a user and grant access to the database.
* Update your Django settings in `backend/chyrp_backend/chyrp_backend/settings.py` with your database details:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'chyrp_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 3. Backend Setup

```sh
cd backend
python -m venv venv
# Activate the virtual environment:
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate
pip install -r requirements.txt
cd chyrp_backend
python manage.py migrate
python manage.py runserver
```

### 4. Frontend Setup

```sh
cd ../../frontend/chyrp_frontend
npm install
npm start
```

---

## Usage

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8000](http://localhost:8000)

---

## License

This project is for educational purposes during Clone Fest.
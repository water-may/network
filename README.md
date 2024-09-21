# README for Social Network Project

## Overview

The Social Network project is a web-based application built with Django that allows users to make posts, edit them, follow other users, and like posts. The application also features user authentication and pagination.

## Features

- **User Authentication**: Sign up, log in, and log out functionalities.
- **Posts Management**: Users can create, edit, and delete their posts.
- **Follow System**: Users can follow and unfollow other users.
- **Likes**: Users can like and unlike posts.
- **Pagination**: Posts are displayed with pagination to improve page load times.

## Tech Stack

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite (default Django database)

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/social-network.git
   cd social-network
   ```

2. **Set up a virtual environment** (Optional but recommended)
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```sh
   python manage.py migrate
   ```

5. **Start the server**
   ```sh
   python manage.py runserver
   ```

## Usage

Once the server is running, visit `http://127.0.0.1:8000/` in your browser to start using the application. You can sign up for a new account and then log in to access all features.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name – [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/your-username/social-network](https://github.com/your-username/social-network)

## Acknowledgements

- [Django](https://www.djangoproject.com/)
- [Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)

This README provides a comprehensive guide to setting up and navigating the Social Network project. It includes all necessary steps from installation to usage, ensuring that anyone can get the project up and running smoothly.

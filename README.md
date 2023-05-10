# chainrxn

Play chain reaction on multiple devices

## Local Setup
(If you want to play by hosting the game website locally)
Prerequisites -
[+] Python 3.7 or greater
[+] Django
[+] Docker

1. Create a virtual environment and install stuff by running
    ```bash
    pip install -r requirements.txt
    ```
2. Run redis in a docker container
    ```bash
    docker run -p 6379:6379 -d redis:5
    ```
3. Start the Django server
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```
4. Lookup your machine's IP address and ask everyone to enter your IP address 
in the browser
5. Play!
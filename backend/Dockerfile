FROM python:3.9


WORKDIR /myway


COPY ./requirements.txt /myway/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /myway/requirements.txt


COPY ./ /myway


CMD ["fastapi", "run", "app.py", "--port", "80"]

FROM continuumio/anaconda3

USER root

ENV PATH /opt/conda/envs/app-env/bin:$PATH
ENV LD_LIBRARY_PATH /opt/conda/envs/app-env/lib

ENV PORT 8000

EXPOSE 8000

RUN mkdir /app
COPY . /app/

WORKDIR /app

RUN apt update
RUN conda create --name app-env -c conda-forge nest-simulator -y
RUN echo "source activate app-env" > ~/.bashrc

RUN /bin/bash -c "source activate app-env"
RUN conda config --append channels conda-forge
RUN conda install --yes --file requirements.txt

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
#uvicorn main:app --host 0.0.0.0 --port 8000

# building the image
# sudo docker build -f ./Dockerfile --tag neuro-app-backend:0.1.0 .

# running the image
# sudo docker run --rm -it --privileged -p 8000:8000 neuro-app-backend:0.1.0

pipeline {
    agent any

    stages {

        stage('Check Files') {
            steps {
                sh 'ls'
            }
        }

        stage('Docker Version') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Docker Compose Build') {
            steps {
                sh 'DOCKER_BUILDKIT=0 docker-compose build'
            }
        }

    }
}
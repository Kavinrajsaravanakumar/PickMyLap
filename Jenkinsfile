pipeline {
    agent any

    stages {

        stage('Check Files') {
            steps {
                sh 'ls'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

    }
}
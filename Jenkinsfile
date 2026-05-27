pipeline {
    agent any

    stages {

        stage('Check Files') {
            steps {
                bat 'dir'
            }
        }

        stage('Check Docker') {
            steps {
                bat 'docker --version'
            }
        }

    }
}
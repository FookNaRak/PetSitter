pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                git branch: 'main', url: 'https://github.com/FookNaRak/DevtoolsProject.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker-compose down || true'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Deploy Containers') {
            steps {
                echo '🚀 Deploying updated containers...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Build or Deploy failed.'
        }
    }
}

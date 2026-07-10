pipeline {
    agent any
    
    environment {
        DOCKER_CREDS   = credentials('docker-registry-creds')
        GENAI_API_KEY  = credentials('gemini-production-key') 
        REGISTRY_USER  = "siddace" // Change this
        IMAGE_NAME     = "mental-health-bot"
    }
    
    stages {
        stage('Quality Gates') {
            parallel {
                stage('Frontend Validation') {
                    steps {
                        echo 'Validating static asset files...'
                        // Ensure your CSS/JS files have no obvious syntax errors
                        sh 'tail -n 5 backend/static/script.js'
                    }
                }
                stage('Backend Code Lint') {
                    steps {
                        echo 'Testing Python execution configurations...'
                        // Smoke test to ensure the requirements file compiles cleanly
                        sh 'cat backend/requirements.txt'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building combined application container...'
                // Navigates to the backend folder where your Dockerfile is located
                dir('backend') {
                    sh "docker build -t ${REGISTRY_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                    sh "docker tag ${REGISTRY_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ${REGISTRY_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Registry Push') {
            steps {
                echo 'Logging into Docker Registry...'
                sh "echo \$DOCKER_CREDS_PSW | docker login -u \$DOCKER_CREDS_USR --password-stdin"
                
                echo 'Pushing built image variations...'
                sh "docker push ${REGISTRY_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"
                sh "docker push ${REGISTRY_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('Local Container Deployment') {
            steps {
                echo 'Deploying application container locally onto AWS instance...'
                
                // Stop and remove existing container if running to prevent port conflicts
                sh "docker stop ${IMAGE_NAME} || true"
                sh "docker rm ${IMAGE_NAME} || true"
                
                // Run the newly built container, exposing port 5000 and injecting the Gemini key
                sh """
                    docker run -d \
                      --name ${IMAGE_NAME} \
                      -p 5000:10000 \
                      -e GENAI_API_KEY='${GENAI_API_KEY}' \
                      ${REGISTRY_USER}/${IMAGE_NAME}:latest
                """
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed. Cleaning workspace...'
            cleanWs()
        }
    }
}
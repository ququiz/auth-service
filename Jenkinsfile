pipeline {
    agent any
   
    stages {
        stage ('build and push') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/ququiz/auth-service']])
                sh 'chmod 777 ./push.sh'
                sh './push.sh'
                sh 'docker stop ququiz-authentications && docker rm ququiz-authentications'
                sh 'docker rmi lintangbirdas/ququiz-auth-adam:v1.0'
            }
        }
        stage ('docker compose up') {
            steps {
                build job: "ququiz-compose", wait: true
            }
        }
    }

}
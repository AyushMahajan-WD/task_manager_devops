
PERN Task Manager – Install Guide
=================================


Project Structure
-----------------
pern-task-manager/
  <ls>backend/        #Contains Dockerfile and source code for backend
  frontend/       #Contains Dockerfile and source code for frontend
  k8s/            #Contains k8s defination files
  README.md       #Containes all the info about applicaton </ls>

Backend Setup
---------------------------
 <ls>NODE_ENV: production</ls>
   port: "4000"    
   PGHOST: db-service.default.svc.cluster.local      
   PGPORT: "5432"    
   PGDATABASE: pern_task_manager    
   PGUSER: postgres    
   PGPASSWORD: postgres    
   ALLOWED_HOSTS: localhost,127.0.0.1,taskmanager.local, <public_ip>,<dns>    


Frontend Setup
----------------------------
  VITE_API_URL: "http://129.154.247.171:30001"

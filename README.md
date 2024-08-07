# lightweight-cron

In-process cron scheduler that accepts a job and executes it periodically.

## Brief Description of the Solution

We need to create a cron scheduler or task scheduler where every task is scheduled to run at a specific time. To address this, we need a queue where jobs can be pushed and executed. For this project, we chose to use BullMQ, a Node.js library that implements a fast and robust queue system built on top of Redis. This choice helps in reducing complexity in modern microservices architecture.

### Why BullMQ?

BullMQ provides several features that are essential for achieving our goal:

1. **Priority Queues**: Allows prioritizing jobs so that higher-priority jobs are executed first.
2. **Delayed Jobs**: Supports jobs that should be delayed and executed at a later time.
3. **Scheduled and Repeatable Jobs**: Enables scheduling jobs to run according to cron specifications and repeating them at regular intervals.
4. **Retries of Failed Jobs**: Automatically retries jobs that have failed, increasing the reliability of the system.
5. **Automatic Recovery from Process Crashes**: Ensures the system recovers gracefully from crashes, maintaining the integrity of the job queue.

## Project Overview

### Features

- **In-process Scheduling**: Schedules and executes jobs within the Node.js process.
- **Job Queue Management**: Manages job queues with BullMQ, providing robust and scalable job handling.
- **Periodic Execution**: Executes jobs periodically according to the specified schedule.
- **API Integration**: Allows task management via RESTful API endpoints.

## Setup and Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/lightweight-cron.git
    cd lightweight-cron
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configuration**:
    - Ensure you have a Redis server running.
    - Update the Redis connection settings in `config/index.js` if necessary.

4. **Running the Scheduler**:
    ```bash
    npm start
    ```

## API Endpoints

### Add a Task

You can add a task by sending a POST request to the following endpoint:

**URL**: `http://localhost:8080/task/create`

**Method**: `POST`

**Request Body**:
```json
{
    "taskName": "Task 3",
    "taskType": "Cron",
    "taskDescription": "Test Task 3",
    "taskParams": {
        "countryCode": "EG"
    },
    "executionPath": "Task3.run",
    "isExecutable": "true",
    "cronExpr": "* * * * *",
    "isAsync": false
}
```



##Postman Documentation
For a complete overview of the API endpoints and their usage, refer to the Postman Documentation.

<a href="https://documenter.getpostman.com/view/37433771/2sA3rzLYxz" style="
display: inline-block;
padding: 10px 20px;
font-size: 16px;
font-weight: bold;
color: #fff;
background-color: #007bff;
text-align: center;
text-decoration: none;
border-radius: 5px;
border: none;
">View Postman Documentation</a>


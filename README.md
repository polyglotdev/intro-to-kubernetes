# Introduction to Kubernetes

## What is Kubernetes?

Open-source container orchestration tool designed to automate, deploying, scaling, and operating containerized applications.

Born out of Google's experience running in production workloads at scale

## More about Kubernetes

- Kubernetes is a distributed system
- Machines may be physical, virtual, on-prem, or in the cloud
- Schedules containers on machines
- Moves containers as machines are added/removed
- Can use different container runtimes
- Modular, extensible, and designed to be loosely coupled
- Kubernetes uses a declarative configuration model

## Kubernetes Features

- Automated deployment rollout and rollbacks
- Seamless horizontal scaling
- Secret and configuration management
- Service discovery and load balancing
- Linux and Windows container support
- Simple log collection
- Stateful application support
- Persistent volume management
- CPU and memory resource management
- Bach job execution
- RBA access control

## Deploying Kubernetes

### Single Node Cluster

- Docker Desktop for Mac and Windows
- Minikube
- Kubeadm

### Single-Node K8 Clusters for CI

- Create ephemeral clusters for CI/CD
- Use k3s, k3d, or kind

### Multi-Node Clusters

- Use AWS EKS, Azure AKS, Google GKE
- Use kubeadm, kops, or kubespray
- Use Rancher, OpenShift, or Tanzu for enterprise and lack of vendor lock-in

## Kubernetes Architecture

- Cluster
  - All of the machines running collectively
- Nodes
  - Machines in the cluster
- Worker Nodes
  - Run the containers
- Control Plane
  - Makes global decisions about the cluster
- Pods
  - Containers are run in pods
  - Smallest deployable unit
- Services
  - Define network rules to access the pods
- Deployments
  - Define how to create and update instances of the application

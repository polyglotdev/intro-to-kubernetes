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

## Interacting with Kubernetes

One of the ways you can interact with Kubernetes is through the command line tool `kubectl`. You can also use the K8's API directly. We can also use client libraries.

- Rest API
  - It is possible but not common to work directly with the API server
- Client Libraries
  - Official libraries are available in Go, Python, Java, and others
- kubectl
  - Command-line tool for interacting with the cluster
  - Can be used to deploy applications, inspect and manage cluster resources, and view logs

## Common kubectl Commands

- `kubectl get pods`: List all pods in the current namespace
- `kubectl get nodes`: List all nodes in the cluster
- `kubectl get services`: List all services in the current namespace
- `kubectl get deployments`: List all deployments in the current namespace
- `kubectl get events`: List all events in the current namespace
- `kubectl get configmaps`: List all configmaps in the current namespace
- `kubectl delete pod <pod-name>`: Delete a pod by name
- `kubectl describe pod <pod-name>`: Describe a pod by name
- `kubectl logs <pod-name>`: Print the logs from a pod
- `kubectl exec -it <pod-name> -- /bin/bash`: Open a shell in a pod
- `kubectl apply -f <file>`: Apply a configuration file to the cluster
- `kubectl create -f <file>`: Create a resource from a configuration file
- `kubectl scale deployment <deployment-name> --replicas=3`: Scale a deployment to 3 replicas
- `kubectl expose deployment <deployment-name> --type=LoadBalancer --port=80 --target-port=8080`: Expose a deployment as a service
- `kubectl port-forward <pod-name> 8080:80`: Forward port 8080 on your local machine to port 80 on the pod
- `kubectl run <name> --image=<image> --replicas=3`: Run a deployment with 3 replicas
- `kubectl create secret generic <secret-name> --from-literal=<key>=<value>`: Create a secret from a literal value
- `kubectl create secret generic <secret-name> --from-file=<path>`: Create a secret from a file
- `kubectl get secret <secret-name> -o yaml`: Get a secret in YAML format
- `kubectl get pod <pod-name> -o yaml`: Get a pod in YAML format
- `kubectl get deployment <deployment-name> -o yaml`: Get a deployment in YAML format

## Pods

- A pod is the smallest deployable unit in Kubernetes
- A pod is a group of one or more containers
- Containers in a pod share the network and storage

### Whats in a Pod declaration?

- Container image
- Container ports
- Container restart policy
- Resource limits
- Environment variables
- Volume mounts
- Labels
- Annotations

### Manifest Files

- Declare desired properties of the pod
- Manifests can describe all kinds of resources
- The spec contains the desired state of the resource

### Manifests in action

1. Manifests are sent to the K8s API server
2. The API server stores the manifest in etcd. This is done thru `kubectl apply -f <file>`
3. The API server schedules the pod to a node
4. The Kubelet on the node pulls the image and runs the container
5. The Kubelet reports the status of the pod back to the API server
6. The API server updates the status of the pod in etcd

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: dom-nginx
    image: nginx:latest
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "250m"
```

- `apiVersion`: String that identifies the version of the schema the object should have
- `kind`: The kind of object being created
- `metadata`: Data that helps uniquely identify the object
- `spec`: The desired state of the object
- `containers`: List of containers that should be run in the pod
- `name`: Name of the container
- `image`: The container image to run
- `resources`: Resource limits and requests for the container
- `limits`: The maximum amount of resources the container can use
- `requests`: The amount of resources the container needs to start
- `memory`: The amount of memory the container can use
- `cpu`: The amount of CPU the container can use
- `volumeMounts`: List of volumes that should be mounted in the container
- `volumes`: List of volumes that should be available to the pod
- `labels`: Key-value pairs that can be used to select objects
- `annotations`: Key-value pairs that can be used to store arbitrary data

## Services

- A service is an abstraction that defines a logical set of pods and a policy by which to access them.
- Use labels to select a set of pods
- Service has a fixed IP address

## Namespaces

- Namespaces are a way to divide cluster resources between multiple users, environments, or applications
- By default, all resources are created in the default namespace
- You can create additional namespaces to organize resources
- Also can use role-base access control to restrict access to resources

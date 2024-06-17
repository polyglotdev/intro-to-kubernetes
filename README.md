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

## Service Discovery

### Why Services?

- Supports multi-pod design
- Provides static endpoints for each tier
- Handles Pod IP changes
- Load balances traffic across pods

### Service Discovery Mechanisms

1. Environment variables
   1. Services address automatically injected
   2. Environment variables are updated when service changes
2. DNS
   1. DNS records automatically created in cluster's DNS
   2. Containers automatically configured to query cluster DNS

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-tier
  labels:
    app: microservices
spec:
  ports:
  - port: 8080
  selector:
    tier: app
---
apiVersion: v1
kind: Pod
metadata:
  name: app-tier
  labels:
    app: microservices
    tier: app
spec:
  containers:
    - name: server
      image: lrakai/microservices:server-v1
      ports:
        - containerPort: 8080
      env:
        - name: REDIS_URL
          # Environment variable service discovery
          # Naming pattern:
          #   IP address: <all_caps_service_name>_SERVICE_HOST
          #   Port: <all_caps_service_name>_SERVICE_PORT
          #   Named Port: <all_caps_service_name>_SERVICE_PORT_<all_caps_port_name>
          value: redis://$(DATA_TIER_SERVICE_HOST):$(DATA_TIER_SERVICE_PORT_REDIS)
          # In multi-container example value was
          # value: redis://localhost:6379
```

Kubernetes Service discovery is a mechanism that allows applications running within a Kubernetes cluster to find and communicate with each other. This is essential for microservices architectures where services need to dynamically discover each other due to their ephemeral nature.

### Key Concepts of Kubernetes Service Discovery

1. **Services**:
   1. A Kubernetes Service is an abstraction that defines a logical set of Pods and a policy by which to access them. Services enable loose coupling between dependent Pods.

2. **Labels and Selectors**:
   1. Pods are assigned key-value pairs called labels. A Service uses selectors to identify the Pods it should route traffic to based on their labels.

3. **Service Types**:
   1. **ClusterIP**: Exposes the Service on an internal IP in the cluster. This is the default ServiceType. The Service is only reachable from within the cluster.
   2. **NodePort**: Exposes the Service on the same port of each selected Node in the cluster. This makes the Service accessible from outside the cluster using `<NodeIP>:<NodePort>`.
   3. **LoadBalancer**: Exposes the Service externally using a cloud provider's load balancer.
   4. **ExternalName**: Maps the Service to the contents of the `externalName` field (e.g., `foo.bar.example.com`), returning a CNAME record with its value.

4. **Endpoints**:
   1. Each Service has a list of Endpoints, which are the IP addresses of the Pods that match the Service's selector. The Endpoints resource keeps this list updated as Pods are added or removed.

5. **DNS-based Service Discovery**:
   1. Kubernetes clusters typically have a DNS server (like CoreDNS) that automatically creates DNS records for Kubernetes Services. This allows services to discover each other by name. For example, if a Service named `my-service` exists in the `default` namespace, it can be accessed within the same namespace by simply using the DNS name `my-service`.

6.  **Headless Services**:
   1. A Headless Service is a Service without a ClusterIP. Instead of load-balancing, the DNS server returns the A records (IP addresses) of the Pods backing the Service. This is useful for stateful applications like databases.

### Service Discovery Workflow:

1. **Create a Service**:
   1. Define a Service manifest that specifies the selector labels, ports, and type. Example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

1. **Expose the Service**:
   - When the Service is created, Kubernetes allocates a ClusterIP and sets up the necessary rules to route traffic to the Pods that match the selector.
2. **Access the Service**:
   - Within the cluster, you can access the Service using the DNS name `my-service.default.svc.cluster.local` or just `my-service` if within the same namespace.
   - If the Service type is `NodePort` or `LoadBalancer`, it can be accessed from outside the cluster using the appropriate external endpoint.

### Example Use Case:

Consider a web application consisting of a frontend and backend. The backend is exposed as a Service so the frontend can discover and communicate with it.

1. **Backend Deployment**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: backend-image
          ports:
            - containerPort: 8080
```

2. **Backend Service**:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

3. **Frontend Deployment**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: frontend-image
          ports:
            - containerPort: 80
          env:
            - name: BACKEND_URL
              value: "http://backend:80"
```

### Kubernetes Networking

Kubernetes networking is a complex but fundamental aspect of Kubernetes architecture. It deals with how Pods communicate within the cluster, how traffic is routed to Pods from outside the cluster, and how network policies are applied to ensure secure communication. Here’s an in-depth look at the key components and concepts:

#### Key Components and Concepts:

1. **Pod Networking**:
   1. Each Pod in Kubernetes gets its own IP address. Pods can communicate with each other directly using these IP addresses, which ensures isolation and scalability. Kubernetes uses a flat network structure, meaning all Pods can communicate with each other without NAT (Network Address Translation).
2. **Service Networking**:
   1. Services in Kubernetes provide stable IP addresses and DNS names for Pods. They abstract away the individual Pod IP addresses, allowing for load balancing and service discovery.
3. **Network Policies**:
   1. Network Policies are used to control the traffic flow between Pods. They define rules about what traffic is allowed to enter and leave specific Pods, ensuring a secure networking environment within the cluster.
4. **Cluster Networking**:
   1. Kubernetes requires a network plugin (CNI - Container Network Interface) to manage networking within the cluster. Some popular CNI plugins are Calico, Flannel, Weave, and Cilium.

#### Detailed Breakdown:

1. **Pod-to-Pod Communication**:
   1. **Flat Network Model**: Kubernetes assumes that Pods can communicate with each other directly without NAT. This is achieved using an overlay network managed by a CNI plugin.
   2. **CNI Plugins**: These plugins set up the network interfaces for Pods, assign IP addresses, and route traffic. Examples include:
        - **Calico**: Uses BGP for routing and provides network policies.
        - **Flannel**: Uses VXLAN for creating an overlay network.
        - **Weave**: Uses a mesh network for Pod communication.
        - **Cilium**: Uses eBPF for high-performance networking and security policies.

2. **Service-to-Pod Communication**:
   1. **ClusterIP**: Each Service gets a stable ClusterIP address that load balances traffic to the Pods matching the Service's selector.
   2. **Service Endpoints**: The Endpoints object maintains a list of Pod IPs that match the Service’s selector. The kube-proxy component uses this information to route traffic.

3. **External-to-Internal Communication**:
   1. **NodePort**: Exposes the Service on each Node’s IP at a static port. This allows external traffic to reach the Service by addressing any Node.
   2. **LoadBalancer**: Integrates with cloud provider load balancers to expose the Service externally.
   3. **Ingress**: Provides HTTP and HTTPS routing to Services within the cluster. It is a more flexible and powerful way to expose multiple Services under a single IP address. An Ingress Controller manages the routing rules defined in Ingress resources.

4. **Network Policies**:
   1. **Isolation**: By default, Kubernetes allows all traffic between all Pods. Network Policies can be used to enforce restrictions.
   2. **Policy Definition**: A NetworkPolicy resource specifies how groups of Pods are allowed to communicate with each other and other network endpoints.
   3. **Example**:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: frontend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: backend
  egress:
  - to:
    - podSelector:
        matchLabels:
          role: database
```

5. **DNS and Service Discovery**:
   1. **CoreDNS**: A DNS server that provides DNS-based service discovery within the cluster. It automatically resolves Service names to ClusterIP addresses.
   2. **Service Naming**: Services are accessible via DNS names following the pattern `service-name.namespace.svc.cluster.local`.

### Example Use Case: Setting Up a Kubernetes Network with Calico

1. **Deploy a Kubernetes Cluster**:
   1. Use a tool like `kubeadm`, `kind`, or `minikube` to set up a cluster.
2. **Install Calico**:
   1. Follow the Calico installation guide to set up Calico as the CNI plugin.

```sh
kubectl apply -f https://docs.projectcalico.org/v3.20/manifests/calico.yaml
```

1. **Deploy Sample Applications**:
   1. Create Deployments and Services for a frontend and backend application.
2. **Apply Network Policies**:
   1. Define Network Policies to control traffic between frontend and backend Pods.
3. **Expose Services**:
   1. Use NodePort or Ingress to expose the frontend Service to external traffic.

## Deployments

- A Deployment is a higher-level concept that manages ReplicaSets and Pods
- Deployments are used to define the desired state of the application
- Deployments can scale, update, and rollback application versions
- Deployments are declarative and can be defined in YAML files

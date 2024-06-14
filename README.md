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

### Pod Quality of Service Classes

#### Quality of Service classes[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes)

Kubernetes classifies the Pods that you run and allocates each Pod into a specific _quality of service (QoS) class_. Kubernetes uses that classification to influence how different pods are handled. Kubernetes does this classification based on the [resource requests](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) of the [Containers](https://kubernetes.io/docs/concepts/containers/) in that Pod, along with how those requests relate to resource limits. This is known as [Quality of Service](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/) (QoS) class. Kubernetes assigns every Pod a QoS class based on the resource requests and limits of its component Containers. QoS classes are used by Kubernetes to decide which Pods to evict from a Node experiencing [Node Pressure](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/). The possible QoS classes are `Guaranteed`, `Burstable`, and `BestEffort`. When a Node runs out of resources, Kubernetes will first evict `BestEffort` Pods running on that Node, followed by `Burstable` and finally `Guaranteed` Pods. When this eviction is due to resource pressure, only Pods exceeding resource requests are candidates for eviction.

### Guaranteed[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#guaranteed)

Pods that are `Guaranteed` have the strictest resource limits and are least likely to face eviction. They are guaranteed not to be killed until they exceed their limits or there are no lower-priority Pods that can be preempted from the Node. They may not acquire resources beyond their specified limits. These Pods can also make use of exclusive CPUs using the [`static`](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/#static-policy) CPU management policy.

#### Criteria[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#criteria)

For a Pod to be given a QoS class of `Guaranteed`:

- Every Container in the Pod must have a memory limit and a memory request.
- For every Container in the Pod, the memory limit must equal the memory request.
- Every Container in the Pod must have a CPU limit and a CPU request.
- For every Container in the Pod, the CPU limit must equal the CPU request.

### Burstable[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#burstable)

Pods that are `Burstable` have some lower-bound resource guarantees based on the request, but do not require a specific limit. If a limit is not specified, it defaults to a limit equivalent to the capacity of the Node, which allows the Pods to flexibly increase their resources if resources are available. In the event of Pod eviction due to Node resource pressure, these Pods are evicted only after all `BestEffort` Pods are evicted. Because a `Burstable` Pod can include a Container that has no resource limits or requests, a Pod that is `Burstable` can try to use any amount of node resources.

#### Criteria[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#criteria-1)

A Pod is given a QoS class of `Burstable` if:

- The Pod does not meet the criteria for QoS class `Guaranteed`.
- At least one Container in the Pod has a memory or CPU request or limit.

### BestEffort[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#besteffort)

Pods in the `BestEffort` QoS class can use node resources that aren't specifically assigned to Pods in other QoS classes. For example, if you have a node with 16 CPU cores available to the kubelet, and you assign 4 CPU cores to a `Guaranteed` Pod, then a Pod in the `BestEffort` QoS class can try to use any amount of the remaining 12 CPU cores.

The kubelet prefers to evict `BestEffort` Pods if the node comes under resource pressure.

#### Criteria[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#criteria-2)

A Pod has a QoS class of `BestEffort` if it doesn't meet the criteria for either `Guaranteed` or `Burstable`. In other words, a Pod is `BestEffort` only if none of the Containers in the Pod have a memory limit or a memory request, and none of the Containers in the Pod have a CPU limit or a CPU request. Containers in a Pod can request other resources (not CPU or memory) and still be classified as `BestEffort`.

## Memory QoS with cgroup v2[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)

FEATURE STATE: `Kubernetes v1.22 [alpha]`

Memory QoS uses the memory controller of cgroup v2 to guarantee memory resources in Kubernetes. Memory requests and limits of containers in pod are used to set specific interfaces `memory.min` and `memory.high` provided by the memory controller. When `memory.min` is set to memory requests, memory resources are reserved and never reclaimed by the kernel; this is how Memory QoS ensures memory availability for Kubernetes pods. And if memory limits are set in the container, this means that the system needs to limit container memory usage; Memory QoS uses `memory.high` to throttle workload approaching its memory limit, ensuring that the system is not overwhelmed by instantaneous memory allocation.

Memory QoS relies on QoS class to determine which settings to apply; however, these are different mechanisms that both provide controls over quality of service.

## Some behavior is independent of QoS class[](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#class-independent-behavior)

Certain behavior is independent of the QoS class assigned by Kubernetes. For example:

- Any Container exceeding a resource limit will be killed and restarted by the kubelet without affecting other Containers in that Pod.

- If a Container exceeds its resource request and the node it runs on faces resource pressure, the Pod it is in becomes a candidate for [eviction](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/). If this occurs, all Containers in the Pod will be terminated. Kubernetes may create a replacement Pod, usually on a different node.

- The resource request of a Pod is equal to the sum of the resource requests of its component Containers, and the resource limit of a Pod is equal to the sum of the resource limits of its component Containers.

- The kube-scheduler does not consider QoS class when selecting which Pods to [preempt](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption). Preemption can occur when a cluster does not have enough resources to run all the Pods you defined.

variable "region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name used in resource names and tags."
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name used in resource names and tags."
  type        = string
  default     = "guidra"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones used by the public and private subnets."
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]

  validation {
    condition     = length(var.availability_zones) == 2
    error_message = "Exactly two availability zones are required."
  }
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the two public subnets."
  type        = list(string)
  default     = ["10.0.2.0/24", "10.0.1.0/24"]

  validation {
    condition     = length(var.public_subnet_cidrs) == 2
    error_message = "Exactly two public subnet CIDRs are required."
  }
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the two private subnets."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]

  validation {
    condition     = length(var.private_subnet_cidrs) == 2
    error_message = "Exactly two private subnet CIDRs are required."
  }
}

variable "instance_ami_id" {
  description = "AMI ID for the application instances."
  type        = string
  default     = null
}

variable "instance_type" {
  description = "EC2 instance type for the application servers."
  type        = string
  default     = "t3.small"
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB."
  type        = number
  default     = 8
}

variable "application_port" {
  description = "Port exposed by the application instances."
  type        = number
  default     = 80
}

variable "health_check_path" {
  description = "HTTP health check path used by the target group."
  type        = string
  default     = "/"
}

variable "domain_name" {
  description = "Domain name to discover the issued ACM certificate (used when certificate_arn is not provided)."
  type        = string
  default     = "guidra.tech"
}

variable "certificate_arn" {
  description = "Optional ACM certificate ARN for an HTTPS listener. If null, will look up via domain_name."
  type        = string
  default     = null
}

variable "secret_name" {
  description = "Name of the AWS Secrets Manager secret holding application production environment variables."
  type        = string
  default     = "guidra-prod-secret"
}

variable "alarm_notification_topic_arn" {
  description = "Optional SNS topic ARN for CloudWatch alarm notifications."
  type        = string
  default     = null
}


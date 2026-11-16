variable "name_prefix" {
  description = "Prefix used for compute resource names."
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the application resources."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the application instances."
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID allowed to reach the application instances."
  type        = string
}

variable "ami_id" {
  description = "Optional AMI ID. When null, the latest Amazon Linux 2023 x86_64 AMI is used."
  type        = string
  default     = null
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB."
  type        = number
}

variable "application_port" {
  description = "Port exposed by the application."
  type        = number
}

variable "secret_arn" {
  description = "Optional ARN of the Secrets Manager secret for application configuration."
  type        = string
  default     = null
}

variable "secret_name" {
  description = "Optional name of the Secrets Manager secret for application configuration."
  type        = string
  default     = null
}

variable "aws_region" {
  description = "AWS region for fetching secrets in user data."
  type        = string
  default     = "ap-south-1"
}

variable "tags" {
  description = "Tags applied to compute resources."
  type        = map(string)
  default     = {}
}


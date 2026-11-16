variable "name_prefix" {
  description = "Prefix used for load balancer resource names."
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the load balancer."
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for the internet-facing load balancer."
  type        = list(string)
}

variable "target_instance_ids" {
  description = "EC2 instance IDs registered in the target group."
  type        = list(string)
}

variable "target_port" {
  description = "Port used by the target instances."
  type        = number
}

variable "health_check_path" {
  description = "HTTP health check path."
  type        = string
}

variable "certificate_arn" {
  description = "Optional ACM certificate ARN for HTTPS."
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags applied to load balancer resources."
  type        = map(string)
  default     = {}
}

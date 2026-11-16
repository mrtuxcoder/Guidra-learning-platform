output "vpc_id" {
  description = "ID of the VPC."
  value       = module.networking.vpc_id
}

output "private_subnet_ids" {
  description = "IDs of the private application subnets."
  value       = module.networking.private_subnet_ids
}

output "instance_ids" {
  description = "IDs of the application instances."
  value       = module.compute.instance_ids
}

output "secret_arn" {
  description = "ARN of the application secrets manager secret."
  value       = module.secrets.secret_arn
}

output "load_balancer_dns_name" {
  description = "DNS name of the application load balancer."
  value       = module.load_balancer.dns_name
}

output "load_balancer_url" {
  description = "HTTP URL of the application load balancer."
  value       = "http://${module.load_balancer.dns_name}"
}

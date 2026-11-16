output "instance_ids" {
  description = "IDs of the application instances."
  value       = aws_instance.this[*].id
}

output "private_ips" {
  description = "Private IP addresses of the application instances."
  value       = aws_instance.this[*].private_ip
}

output "security_group_id" {
  description = "Security group ID of the application instances."
  value       = aws_security_group.this.id
}

output "iam_role_name" {
  description = "IAM role name attached to the application instances."
  value       = aws_iam_role.this.name
}

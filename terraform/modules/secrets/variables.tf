variable "name" {
  description = "Name of the secret in AWS Secrets Manager."
  type        = string
}

variable "name_prefix" {
  description = "Prefix for naming resources."
  type        = string
}

variable "tags" {
  description = "Common tags applied to resources."
  type        = map(string)
  default     = {}
}

variable "name_prefix" {
  description = "Prefix used for alarm names."
  type        = string
}

variable "instance_ids" {
  description = "Instance IDs monitored by status check alarms."
  type        = list(string)
}

variable "notification_topic_arn" {
  description = "Optional SNS topic ARN for alarm notifications."
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags applied to monitoring resources."
  type        = map(string)
  default     = {}
}

output "alarm_arns" {
  description = "ARNs of the EC2 status check alarms."
  value       = [for alarm in aws_cloudwatch_metric_alarm.instance_status : alarm.arn]
}

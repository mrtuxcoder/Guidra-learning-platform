resource "aws_cloudwatch_metric_alarm" "instance_status" {
  count = length(var.instance_ids)

  alarm_name          = "${var.name_prefix}-server-${count.index + 1}-status"
  alarm_description   = "EC2 status check failed for server ${count.index + 1}."
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "StatusCheckFailed"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Maximum"
  threshold           = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = var.notification_topic_arn == null ? [] : [var.notification_topic_arn]
  ok_actions          = var.notification_topic_arn == null ? [] : [var.notification_topic_arn]

  dimensions = {
    InstanceId = var.instance_ids[count.index]
  }

  tags = var.tags
}

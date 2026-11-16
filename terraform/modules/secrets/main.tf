resource "aws_secretsmanager_secret" "this" {
  name        = var.name
  description = "Production environment configuration secrets for ${var.name_prefix}"

  tags = var.tags
}

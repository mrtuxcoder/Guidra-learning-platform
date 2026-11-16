data "aws_acm_certificate" "issued" {
  count       = var.certificate_arn == null && var.domain_name != null ? 1 : 0
  domain      = var.domain_name
  statuses    = ["ISSUED"]
  most_recent = true
}

locals {
  certificate_arn = var.certificate_arn != null ? var.certificate_arn : try(data.aws_acm_certificate.issued[0].arn, null)
}

module "networking" {
  source = "./modules/networking"

  name_prefix          = local.name_prefix
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                 = local.common_tags
}

module "secrets" {
  source = "./modules/secrets"

  name        = var.secret_name
  name_prefix = local.name_prefix
  tags        = local.common_tags
}

module "compute" {
  source = "./modules/compute"

  name_prefix           = local.name_prefix
  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  alb_security_group_id = module.load_balancer.security_group_id
  ami_id                = var.instance_ami_id
  instance_type         = var.instance_type
  root_volume_size      = var.root_volume_size
  application_port      = var.application_port
  secret_arn            = module.secrets.secret_arn
  secret_name           = module.secrets.secret_name
  aws_region            = var.region
  tags                  = local.common_tags
}

module "load_balancer" {
  source = "./modules/load_balancer"

  name_prefix         = local.name_prefix
  vpc_id              = module.networking.vpc_id
  public_subnet_ids   = module.networking.public_subnet_ids
  target_instance_ids = module.compute.instance_ids
  target_port         = var.application_port
  health_check_path   = var.health_check_path
  certificate_arn     = local.certificate_arn
  tags                = local.common_tags
}

module "monitoring" {
  source = "./modules/monitoring"

  name_prefix            = local.name_prefix
  instance_ids           = module.compute.instance_ids
  notification_topic_arn = var.alarm_notification_topic_arn
  tags                   = local.common_tags
}

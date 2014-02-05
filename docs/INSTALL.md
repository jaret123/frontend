

Drush install on Fedora 

https://drupal.org/comment/7391934#comment-7391934

Run the MySQL driver install on YUM

Don't use the Drupal install from YUM.  All Drupal code is in the repo.

Install composer -- getcomposer.org

cd service
-- Check the service
php app/check.php
-- Install composer
composer install

-- Install PHP zip (for using phar)
yum install php-pecl-zip

-- Install composer
php /usr/local/bin/composer install

-- Fix timezone settings
yum reinstall tzdata -y

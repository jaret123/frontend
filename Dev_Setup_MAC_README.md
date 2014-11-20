#Xeros  Local Developmental Environmental Setup Read Me
#Initially Created by Ron Kozlowski
#11/20/2014


Programs :


Git: Make sure Git is installe on your computer (was already on my MAC)
    a.
        http://git-scm.com/

MySQL : http://dev.mysql.com/downloads/mysql/
Apache: (Either MAMP or Apple's Sever will work )

IntelliJ : This IDE is preferred by Eylxor †
https://www.jetbrains.com/idea/

† Note this program requires Java Please install Java for Mac (It will prompt you)

Brew: Makes it easy for various setup install (like drush )
      go here and install :

      http://brew.sh/
      command:  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Composer : You must have Composer installed - http://www.abeautifulsite.net/installing-composer-on-os-x/


Other Programs/Accounts/Administrative stuff

Elyxor Gmail Account
Elyxor BitBucket Account
Elyxor DropBox / Xeros Shared
Elyxor Harvest Account


Setting up Dev Xeros

1. SSH Keys for Xeros-qa and Xeros-prod

a. You will need to generate a certificate (this will be used for BitBucket and for ssh to these boxes)
(Not exatly sure how will did this ) ? WILL ? He used OS X keygen then used a brew program to put certs up to servers
then he pasted in public key to bitbucket account

Here is some document help from IntelliJ
Git is installed on your computer.
It is strongly recommended that you use version 1.7.1.1 or higher.

The location of the Git executable file is correctly specified on the Git page of the Preferences dialog box.
Git integration is enabled for the current project root or directory.
If you are going to use a remote repository, create a Git hosting account first. You can access the remote repository through the username/password and keyboard interactive authentication methods supported by the Git integration or through a pair of ssh keys.
Please note the following:

ssh keys are generated outside IntelliJ IDEA. You can follow the instructions from http://inchoo.net/tools/how-to-generate-ssh-keys-for-git-authorization/ or look for other guidelines.
Store the ssh keys in the home_directory \.ssh\ folder. The location of the home directory is defined through environmental variables:
HOME for Unix-like operating systems.
userprofile for the Microsoft Windows operating system.
Make sure, the keys are stored in files with correct names:
id_rsa for the private key.
id_rsa.pub for the public key.
IntelliJ IDEA supports a standard method of using multiple ssh keys, by means of creating .ssh/config file.

b. In your .ssh/config file past in this

Host xeros-qa
        HostName 54.84.61.215
        User fedora
        IdentityFile ~/.ssh/xeros.pem

Host xeros-prod
        HostName 54.84.94.106
        User fedora
        IdentityFile ~/.ssh/xeros.pem


2. Clone Xeros Repository

  On the main menu, choose VCS | Checkout from Version Control | Git. The Clone Repository dialog box opens.
  In the Git Repository URL text box, type the URL of the remote repository which you want to clone.
  Click the Test button next to the Git Repository URL text box to check that connection to the remote repository can be established successfully.
  In the Parent Directory text box, specify the directory where you want IntelliJ IDEA to create a folder for your local Git repository. Use the Browse button browseButton.png button, if necessary.
  In the Directory Name text box, specify the name of the new folder into which the repository will be cloned. Click Clone.
  Create a new project based on the cloned data by accepting the corresponding suggestion displayed by IntelliJ IDEA.


  a. Remote Repository is git@bitbucket.org/elx_pete/xeros-sbeady.git
  b. Pick a location for  your Project ( I piced /Users/<Username>/elyxor/xeros
    This put the xeros-sbeady directory in this folder

 3. Setup WebServer
    There are multiple ways to do this depending on your environment. Some use MMAP other use straight apache install

    a. I use Apple Server (It's free now and works really well)
        I. Launch Server App
        II. Create a New WebSite called xeros.local
            a. Store Site Files in (Pick Drupal Folder in /Users/<Username>/elyxor/xeros/xeros-sbeady/drupal
            b. Click on Advance Settings -> check Allow overrides using .htaccess file
            c. Click ok
    b. do a sudo vi (or nano) /etc/hosts file
        I. 127.0.0.1	xeros.local
    C. Test that xeros.local works (Should see drupal error cause database not setup yet (see below to setup database)

4. Install drush : "Drush is an awesome shell interface for managing Drupal right from your cloud server command line. It is a very useful tool as it helps you perform various admin tasks using just one or two commands in the terminal, replacing the need for many clicks and page refreshes in the UI."
    a. Here are the install instructions https://www.drupal.org/node/1674222
    b. I did my install via brew and not composer
        I. This link shows you how to get install HomeBrew (if you don't already have it) and then install drush
            https://www.drupal.org/node/954766
        II. Once you have drush installed you need to make a symlink in your .drush directory
            ln -s ~rnk/elyxor/xeros/xeros-sbeady/docs/xeros.aliases.drushrc.php ~rnk/.drush/xeros.aliases.drushrc.php
        III. Once you have done this you can test to see if it works by doing this command
                drush @xeros.qa status


5. Xeros Database Setup
    A. Either use mysql from command line create a database I used xeros as database name
    B. <optional> Create a user of your choice if you don't want to have root for this databse
        I.   GRANT ALL PRIVILEGES ON *.* TO 'anotheruser'@'%' IDENTIFIED BY PASSWORD 'anotherpassword' WITH GRANT OPTION;

    C. Create local settings file for database
        I. using IntelliJ navigate to drupal /sites/default
        II. create a php file called settings.local.php
        and past this in
         <?php
         $databases = array(
              'default' =>
                array(
                  'default' =>
                    array(
                      'database' => 'xeros',
                      'username' => 'xeros',
                      'password' => 'xeros',
                      'host'     => 'localhost',
                      'port'     => '',
                      'driver'   => 'mysql',
                      'prefix'   => '',
                    ),
                ),
            );
            $conf['database_script_dir'] = "/Users/rnk/elyxor/xeros/xeros-sbeady/db/updates/";
            $conf['mysql_bin'] = "/usr/local/mysql/bin/mysql";

    Note: Change your database , username , password to match
    Also need to point where the database_script_dir is according to your install location
    The mysql_bin path can be determined by doing a 'which mysql' in the terminal

    D. Once database and permissions are set up use drush to install database from server
        I. drush sql-sync @xeros.qa @xeros.local

        Note: This should run and make sync all the tables, etc you will need for xeros.

6. Run Composer : You need to run composer to make sure you have all the dependencies for this project
    A. Using terminal navicate to the xeros-sbeady folder
    B. Run sudo composer install
    C. Then Run php app/console cache:clear --env=prod
    D. You will have to then edit the parameters.yml file for your database connectivity this is located in the service/app/config folder
    It should look like this
    # This file is auto-generated during the composer install
    parameters:
        database_driver: pdo_mysql
        database_host: 127.0.0.1
        database_port: null
        database_name: xeros
        database_user: xeros
        database_password: xeros
        mailer_transport: smtp
        mailer_host: 127.0.0.1
        mailer_user: null
        mailer_password: null
        locale: en
        secret: ThisTokenIsNotSoSecretChangeIt

        I. Make the changes that reflect you database connectivity : database_name, user, password.

        II. Once you have done this save the file and run php app/console cache:clear --env=prod again


7. Login and Test: Once the above has been completed with out errors test xeros.local in your browser
    A. Go to xeros.local
    B. Login using username xerosadmin password sorex39
    c. Check to see that everything is running correctly .

    Note: We had a few permission issues that had to be address for instance
    chmod -R 777 app folder . However this create issues with the repo . TODO:// Make sure we figure out best way to do this? WILL?


Git Revision Control :

Elyxor has moved to a Feature Branch WorkFlow
https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow/

The core idea behind the Feature Branch Workflow is that all feature development should take place in a dedicated branch instead of the master branch. This encapsulation makes it easy for multiple developers to work on a particular feature without disturbing the main codebase. It also means the master branch will never contain broken code, which is a huge advantage for continuous integration environments.

# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "trusty64"

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  # box specific settings
  config.vm.define :web, primary: true do |web_config|
    # we'll want to use this when we have built our own boxes
    # currently just use precise64
    # web_config.vm.box = "web"

    web_config.vm.host_name = "wed-host"
    # web_config.vm.network :hostonly, "10.10.10.10"
    web_config.vm.network :private_network, ip: "192.168.33.29"

    # only the web should be publicly available to the host
    web_config.vm.network :forwarded_port, guest: 80, host: 8989

    web_config.vm.provider :virtualbox do |vb|
      vb.name = "wed_host"
      vb.customize ["modifyvm", :id, "--cpuexecutioncap", "90"]
      vb.customize ["modifyvm", :id, "--memory", "2048"]
      vb.customize ["modifyvm", :id, "--cpus", 2]
    end

    web_config.vm.synced_folder "./", "/vagrant", :nfs => true
  end

  # config.vm.define :db do |db_config|
  #   # we'll want to use this when we have built our own boxes
  #   # currently just use precise64
  #   # db_config.vm.box = "mysql"

  #   db_config.vm.host_name = "db"
  #   db_config.vm.network :private_network, ip: "192.168.33.11"

  #   db_config.vm.provider :virtualbox do |vb|
  #     vb.name = "cluster_db"
  #     vb.customize ["modifyvm", :id, "--memory", "256"]
  #   end
  # end

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network :public_network

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  config.ssh.forward_agent = true

  ### Ansible ###
  config.vm.provision "ansible" do |ansible|
    # ansible.inventory_path = "provisioning/vmhosts"
    ansible.verbose = "vv"
    ansible.extra_vars = { user: "vagrant" }
    ansible.playbook = "provisioner/playbook.yml"
  end

end

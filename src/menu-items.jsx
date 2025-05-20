const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics'
        }
      ]
    },
    {
      id: 'utilities',
      title: 'Utilities',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'role',
          title: 'Roles',
          type: 'collapse',
          icon: 'feather icon-shield',
          children: [
            {
              id: 'create role',
              title: 'Create Role',
              type: 'item',
              url: '/roles/create-role'
            },
            {
              id: 'all roles',
              title: 'All Roles',
              type: 'item',
              url: '/roles/all-role'
            },
          ]
        },
        {
          id: 'user',
          title: 'User',
          type: 'collapse',
          icon: 'feather icon-user',
          children: [
            {
              id: 'add user',
              title: 'Add User',
              type: 'item',
              url: '/users/add-user'
            },
            {
              id: 'users list',
              title: 'Users List',
              type: 'item',
              url: '/users/users-list'
            },
          ]
        },
        {
          id: 'branch',
          title: 'Location',
          type: 'collapse',
          icon: 'feather icon-map-pin',
          children: [
            {
              id: 'branch',
              title: 'Add Branch',
              type: 'item',
              url: '/branch/add-branch'
            },
            {
              id: 'branch-list',
              title: 'Branch List',
              type: 'item',
              url: '/branch/branch-list'
            },
          ]
        },
        {
          id: 'model',
          title: 'Model',
          type: 'collapse',
          icon: 'fas fa-motorcycle',
          children: [
            {
              id: 'add model',
              title: 'Add Model',
              type: 'item',
              url: '/model/add-model'
            },
            {
              id: 'all models',
              title: 'All Models',
              type: 'item',
              url: '/model/model-list'
            }
          ]
        },
        {
          id: 'headers',
          title: 'Headers',
          type: 'collapse',
          icon: 'feather icon-settings',
          children: [
            {
              id: 'add header',
              title: 'Add Header',
              type: 'item',
              url: '/headers/add-header'
            },
            {
              id: 'headers list',
              title: 'Headers List',
              type: 'item',
              url: '/headers/headers-list'
            }
          ]
        },
        {
          id: 'documents',
          title: 'Documents',
          type: 'collapse',
          icon: 'fas fa-file-alt',
          children: [
            {
              id: 'add document',
              title: 'Add Document',
              type: 'item',
              url: '/documents/add-document'
            },
            {
              id: 'documents list',
              title: 'Documents List',
              type: 'item',
              url: '/documents/documents-list'
            },
          ]
        },
        {
          id: 'conditions',
          title: 'Terms & conditions',
          type: 'collapse',
          icon: 'fas fa-file-contract',
          children: [
            {
              id: 'add condition',
              title: 'Add',
              type: 'item',
              url: '/conditions/add-condition'
            },
            {
              id: 'conditions list',
              title: 'Conditions List',
              type: 'item',
              url: '/conditions/conditions-list'
            }
          ]
        },
        {
          id: 'offers',
          title: 'Offers',
          type: 'collapse',
          icon: 'fas fa-tags',
          children: [
            {
              id: 'add offer',
              title: 'Add Offer',
              type: 'item',
              url: '/offers/add-offer'
            },
            {
              id: 'offers List',
              title: 'Offer List',
              type: 'item',
              url: '/offers/offer-list'
            }
          ]
        },
        {
          id: 'attachments',
          title: 'Attachments',
          type: 'collapse',
          icon: 'fas fa-file-alt',
          children: [
            {
              id: 'add attachment',
              title: 'Add Attachments',
              type: 'item',
              url: '/attachments/add-attachments'
            },
            {
              id: 'attachments list',
              title: 'Attachments List',
              type: 'item',
              url: '/attachments/attachments-list'
            }
          ]
        },
        {
          id: 'customers',
          title: 'Customers',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'customers list',
              title: 'Customers List',
              type: 'item',
              url: '/customers/customers-list'
            },
          ]
        },
      ]
    },
  ]
};

export default menuItems;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { SPHttpClient } from '@microsoft/sp-http';

export type Command = {
	id: string;
	icon?: string;
	name: string;
	keyword?: string;
	section?: string;
	perform: () => void;
};

const updateQueryStringParameter = (url: string, key: string, value: string) => {
	// eslint-disable-next-line @rushstack/security/no-unsafe-regexp
	const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
	const separator = url.indexOf('?') !== -1 ? '&' : '?';

	if (url.match(re)) {
		return url.replace(re, '$1' + key + '=' + value + '$2');
	} else {
		return url + separator + key + '=' + value;
	}
};

const openPage = (url: string, newWindow = false) => {
	if (newWindow) {
		window.open(url);
	} else {
		window.location.href = url;
	}
};

const adminUrl = `https://${window.location.hostname.replace('.sharepoint.com', '-admin.sharepoint.com')}`;

export const CommandList = (context: ApplicationCustomizerContext): Command[] => {
	const SiteActions: Command[] = [
		{
			id: 'add-a-page',
			name: 'Add a page',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/CreateSitePage.aspx`);
			}
		},
		{
			id: 'add-an-app',
			name: 'Add an app',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/appStore.aspx#/myApps?entry=SettingAddAnApp`);
			}
		},
		{
			id: 'site-contents',
			name: 'Site contents',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/viewlsts.aspx`);
			}
		},
		{
			id: 'hub-site-settings',
			name: 'Hub site settings',
			perform: () => {
				(window as any)._spLaunchHubSettings();
			}
		},
		{
			id: 'site-information',
			name: 'Site information',
			perform: () => {
				(window as any)._spLaunchSiteSettings();
			}
		},
		{
			id: 'site-permissions',
			name: 'Site permissions',
			perform: () => {
				(window as any)._spLaunchSitePermissions();
			}
		},
		{
			id: 'apply-a-site-template',
			name: 'Apply a site template',
			perform: () => {
				(window as any)._spLaunchSiteTemplates();
			}
		},
		{
			id: 'site-usage',
			name: 'Site usage',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/siteanalytics.aspx`);
			}
		},
		{
			id: 'site-performance',
			name: 'Site performance',
			perform: () => {
				(window as any)._spSitePerformanceScorePage();
			}
		},
		{
			id: 'schedule-site-launch',
			name: 'Schedule site launch',
			perform: () => {
				(window as any)._spSiteLaunchSchedulerPage();
			}
		},
		{
			id: 'change-the-look',
			name: 'Change the look',
			perform: () => {
				(window as any)._spLaunchChangeTheLookPanel();
			}
		}
	];

	SiteActions.forEach((a) => {
		a.section = 'Site actions';
	});

	const SiteSettings: Command[] = [
		{
			id: 'people-and-groups',
			name: 'People and groups',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/people.aspx`);
			}
		},
		{
			id: 'site-permissions',
			name: 'Site permissions',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/user.aspx`);
			}
		},
		{
			id: 'site-collection-administrators',
			name: 'Site collection administrators',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/mngsiteadmin.aspx`);
			}
		},
		{
			id: 'site-app-permissions',
			name: 'Site app permissions',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/appprincipals.aspx?Scope=Web`);
			}
		},
		{
			id: 'site-columns',
			name: 'Site columns',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/mngfield.aspx`);
			}
		},
		{
			id: 'site-content-types',
			name: 'Site content types',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/mngctype.aspx?RedirectToModernExperience=true`);
			}
		},
		{
			id: 'regional-settings',
			name: 'Regional settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/regionalsetng.aspx`);
			}
		},
		{
			id: 'language-settings',
			name: 'Language settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/muisetng.aspx`);
			}
		},
		{
			id: 'export-translations',
			name: 'Export Translations',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/exporttranslations.aspx`);
			}
		},
		{
			id: 'import-translations',
			name: 'Import Translations',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/importtranslations.aspx`);
			}
		},
		{
			id: 'user-alerts',
			name: 'User alerts',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/sitesubs.aspx`);
			}
		},
		{
			id: 'rss',
			name: 'RSS',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/siterss.aspx`);
			}
		},
		{
			id: 'workflow-settings',
			name: 'Workflow settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/wrksetng.aspx`);
			}
		},
		{
			id: 'term-store-management',
			name: 'Term store management',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/termstoremanager.aspx?RedirectToModernExperience=true`);
			}
		},
		{
			id: 'result-sources',
			name: 'Result Sources',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/manageresultsources.aspx?level=site`);
			}
		},
		{
			id: 'result-types',
			name: 'Result Types',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/manageresulttypes.aspx?level=site`);
			}
		},
		{
			id: 'query-rules',
			name: 'Query Rules',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/listqueryrules.aspx?level=site`);
			}
		},
		{
			id: 'schema',
			name: 'Schema',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/listmanagedproperties.aspx?level=site`);
			}
		},
		{
			id: 'search-settings',
			name: 'Search Settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/enhancedSearch.aspx?level=site`);
			}
		},
		{
			id: 'search-and-offline-availability',
			name: 'Search and offline availability',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/srchvis.aspx`);
			}
		},
		{
			id: 'configuration-import',
			name: 'Configuration Import',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/importsearchconfiguration.aspx?level=site`);
			}
		},
		{
			id: 'configuration-export',
			name: 'Configuration Export',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/exportsearchconfiguration.aspx?level=site`);
			}
		},
		{
			id: 'title,-description,-and-logo',
			name: 'Title, description, and logo',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/prjsetng.aspx`);
			}
		},
		{
			id: 'quick-launch',
			name: 'Quick launch',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/quiklnch.aspx`);
			}
		},
		{
			id: 'change-the-look',
			name: 'Change the look',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/designgallery.aspx`);
			}
		},
		{
			id: 'manage-site-features',
			name: 'Manage site features',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/ManageFeatures.aspx`);
			}
		},
		{
			id: 'enable-search-configuration-export',
			name: 'Enable search configuration export',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/Enablesearchconfigsettings.aspx`);
			}
		},
		{
			id: 'recycle-bin',
			name: 'Recycle bin',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/AdminRecycleBin.aspx`);
			}
		},
		{
			id: 'search-result-sources',
			name: 'Search Result Sources',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/manageresultsources.aspx?level=sitecol`);
			}
		},
		{
			id: 'search-result-types',
			name: 'Search Result Types',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/manageresulttypes.aspx?level=sitecol`);
			}
		},
		{
			id: 'search-query-rules',
			name: 'Search Query Rules',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/listqueryrules.aspx?level=sitecol`);
			}
		},
		{
			id: 'search-schema',
			name: 'Search Schema',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/listmanagedproperties.aspx?level=sitecol`);
			}
		},
		{
			id: 'search-settings',
			name: 'Search Settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/enhancedSearch.aspx?level=sitecol`);
			}
		},
		{
			id: 'search-configuration-import',
			name: 'Search Configuration Import',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/importsearchconfiguration.aspx?level=sitecol`);
			}
		},
		{
			id: 'search-configuration-export',
			name: 'Search Configuration Export',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/exportsearchconfiguration.aspx?level=sitecol`);
			}
		},
		{
			id: 'site-collection-features',
			name: 'Site collection features',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/ManageFeatures.aspx?Scope=Site`);
			}
		},
		{
			id: 'site-hierarchy',
			name: 'Site hierarchy',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/vsubwebs.aspx`);
			}
		},
		{
			id: 'site-collection-audit-settings',
			name: 'Site collection audit settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/AuditSettings.aspx`);
			}
		},
		{
			id: 'portal-site-connection',
			name: 'Portal site connection',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/portal.aspx`);
			}
		},
		{
			id: 'site-collection-app-permissions',
			name: 'Site collection app permissions',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/appprincipals.aspx`);
			}
		},
		{
			id: 'storage-metrics',
			name: 'Storage Metrics',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/storman.aspx`);
			}
		},
		{
			id: 'content-type-publishing',
			name: 'Content type publishing',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/contenttypesyndicationhubs.aspx`);
			}
		},
		{
			id: 'html-field-security',
			name: 'HTML Field Security',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/HtmlFieldSecurity.aspx`);
			}
		},
		{
			id: 'site-collection-health-checks',
			name: 'Site collection health checks',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/sitehealthcheck.aspx`);
			}
		},
		{
			id: 'site-collection-upgrade',
			name: 'Site collection upgrade',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/siteupgrade.aspx`);
			}
		},
		{
			id: 'configure-search-settings',
			name: 'Configure search settings',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/SiteAdmin.aspx`);
			}
		}
	];

	SiteSettings.forEach((a) => {
		a.section = `Site settings`;
	});

	const AdminCenter: Command[] = [
		{
			id: 'sharepoint-admin-center',
			name: 'SharePoint Admin Center',
			perform: () => {
				openPage(adminUrl);
			}
		},
		{
			id: 'home',
			name: 'Home',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/home`);
			}
		},
		{
			id: 'active-sites',
			name: 'Active sites',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/siteManagement`);
			}
		},
		{
			id: 'deleted-sites',
			name: 'Deleted sites',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/recycleBin`);
			}
		},
		{
			id: 'sharing',
			name: 'Sharing',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/sharing`);
			}
		},
		{
			id: 'access-control',
			name: 'Access control',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/accessControl`);
			}
		},
		{
			id: 'settings',
			name: 'Settings',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/settings`);
			}
		},
		{
			id: 'term-store',
			name: 'Term store',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/termStoreAdminCenter`);
			}
		},
		{
			id: 'content-type-gallery',
			name: 'Content type gallery',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/contentTypes`);
			}
		},
		{
			id: 'migration',
			name: 'Migration',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/migration`);
			}
		},
		{
			id: 'content-services',
			name: 'Content services',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/termStoreAnalytics`);
			}
		},
		{
			id: 'api-access',
			name: 'API access',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/webApiPermissionManagement`);
			}
		},
		{
			id: 'more-features',
			name: 'More features',
			perform: () => {
				openPage(`${adminUrl}/_layouts/15/online/AdminHome.aspx#/classicFeatures`);
			}
		},
		{
			id: 'term-store',
			name: 'Term store',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/TermStoreManager.aspx`);
			}
		},
		{
			id: 'user-profiles',
			name: 'User profiles',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/TenantProfileAdmin/ManageUserProfileServiceApplication.aspx`);
			}
		},
		{
			id: 'search',
			name: 'Search',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/searchadmin/TA_SearchAdministration.aspx`);
			}
		},
		{
			id: 'apps',
			name: 'Apps',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/tenantAppCatalog.aspx`);
			}
		},
		{
			id: 'bcs',
			name: 'BCS',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/bdc/TA_BCSHome.aspx`);
			}
		},
		{
			id: 'secure-store',
			name: 'Secure store',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/sssvc/TA_ManageSSSvcApplication.aspx`);
			}
		},
		{
			id: 'records-management',
			name: 'Records management',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/TA_OfficialFileAdmin.aspx`);
			}
		},
		{
			id: 'info-path',
			name: 'InfoPath',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/TenantForms.FormServer.aspx`);
			}
		},
		{
			id: 'hybrid-picker',
			name: 'Hybrid picker',
			perform: () => {
				openPage(`https://cparsons-admin.sharepoint.com/_layouts/15/online/SharePointHybridSettings.aspx`);
			}
		}
	];

	AdminCenter.forEach((a) => {
		a.section = `Admin center`;
	});

	const UserTools: Command[] = [
		{
			id: 'sign-out',
			name: 'Sign out',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/SignOut.aspx`);
			}
		},
		{
			id: 'view-account',
			name: 'View account',
			perform: () => {
				openPage(`https://myaccount.microsoft.com`);
			}
		},
		{
			id: 'my-office-profile',
			name: 'My Office profile',
			perform: () => {
				openPage(`https://nam.delve.office.com`);
			}
		}
	];

	UserTools.forEach((a) => {
		a.section = `User tools`;
	});

	const DevelopmentTools: Command[] = [
		{
			id: 'workbench',
			name: 'Workbench',
			perform: () => {
				openPage(`${context.pageContext.site.absoluteUrl}/_layouts/15/workbench.aspx`);
			}
		},
		{
			id: 'tenant-app-catalog',
			name: 'Tenant app catalog',
			perform: async () => {
				const settingsResponse = await context.spHttpClient.get('/_api/SP_TenantSettings_Current', SPHttpClient.configurations.v1);
				const settings = await settingsResponse.json();

				openPage(settings.CorporateCatalogUrl);
			}
		},
		{
			id: 'maintenance-mode',
			name: 'Maintenance mode',
			perform: () => {
				openPage(updateQueryStringParameter(window.location.href, 'maintenancemode', 'true'));
			}
		},
		{
			id: 'disable-custom-extensions-and-web-parts',
			name: 'Disable custom extensions and web parts',
			perform: () => {
				openPage(updateQueryStringParameter(window.location.href, 'maintenancemode', 'true'));
			}
		}
	];

	DevelopmentTools.forEach((a) => {
		a.section = `Development tools`;
	});

	const Azure: Command[] = [
		{
			id: 'azure-active-directory',
			name: 'Azure Active Directory',
			perform: () => {
				openPage('https://aad.portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview');
			}
		}
	];

	Azure.forEach((a) => {
		a.section = `Azure`;
	});

	return [...SiteActions, ...SiteSettings, ...AdminCenter, ...UserTools, ...DevelopmentTools, ...Azure];
};

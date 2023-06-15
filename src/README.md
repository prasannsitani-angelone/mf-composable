


## Good to Go checklist from developers

### New Feature development

 - **Add a testid attribute for E2E testing** 
	 - To elements/containers having readonly data  
	 - Interactive elements/containers
 - **Browser testing**
     - chrome 	
     - safari 	
    	 - Tabular structure 	
    	 - input types
    		 - Input type = number behaves differently in iOS, it allows text also 
 - **Hydration to be tested on slower network**  
         
	 - All CTAs should be replaced with a skeleton loader till the page gets
	   hydrated
	 - All reactive functions dependent on page data, should    be  assessed
	   on slow network
 - **Platform testing**
     - **Mobile Web**- Should be tested both in chrome and safari emulators    (prefrebaly for IOS device)
     - **Tablet** - Page may follow mobile/desktop design (if tablet design is    not there) or should be presentable
     - **Desktop Web** - Browser Testing
     - **Spark web view testing in Mobile** - mock the headers used to determine    the spark iOS/android platform via mod header
	     - Android headers 
	    	 ```
	    	 platform: sparkandroid | webview
	     - IOS headers 
	    	 ```
	    	 platform: sparkios
	     - AngelBee:   
	    	 ```
	    	 platform : angelbeeios

### Enhancements
 - **Add a testid attribute for E2E testing - only if needed** 
	 - To elements/containers having readonly data  
	 - Interactive elements/containers
 - **Browser testing**
 - **Hydration to be tested on slower network  - Only If needed** 
		 - Say if new CTAs are added and has to be visible on page load or are dependent on page data for interaction, skeletan loader can be added till page gets hydrated
 - **Platform testing**
	 -  **Mobile Web**
	 - **Tablet**
	 - **Desktop Web**
	 - **Spark web view testing in mobile - Only if needed**
		 - Changes has to be rendered conditionally based on platform
		 - If the rendering of surrounding elements of enhanced target element has conditional dependency on platform 

### Bug Fixes
 - **Add a testid attribute for E2E testing - only if needed** 
 - **Browser testing - Only If needed**
		 - Say if the fixes involves input elements, table etc.
 - **Hydration to be tested on slower network  - Only If needed** 
		 - Say if new CTAs are added as part of bug fix
 - **Platform testing  - Only If needed**
		 - Say changes related to restructuring of page as part of fix
		 - Fixes related to platform based rendering
		 - Changes in input elements
		 - etc.
